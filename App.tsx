import React, { useState, useCallback, useRef } from 'react';
import { ControlsPanel } from './components/ControlsPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { StyleSettings, WritingInstrument } from './types';
import { generateTextFromPrompt, analyzeHandwritingStyle } from './services/geminiService';

const App: React.FC = () => {
    const defaultText = "This is a sample of the generated handwriting. You can type your own text, upload a PDF, or use AI to generate content. Adjust the settings on the left to customize the appearance.";
    const [text, setText] = useState<string>(defaultText);
    const [settings, setSettings] = useState<StyleSettings>({
        fontFamily: 'Caveat',
        instrument: 'pen',
        color: '#1a3a6b',
        thickness: 500,
        lineHeight: 2.5,
        pressure: 50,
        smudgeLevel: 0,
        paper: 'lined',
        wordSpacing: 0.5,
        letterRotation: 2,
        verticalShift: 2,
        horizontalSkew: 4,
        inkBleed: 10,
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const previewRef = useRef<HTMLDivElement>(null);

    const handleSettingsChange = useCallback(<K extends keyof StyleSettings>(key: K, value: StyleSettings[K]) => {
        setSettings(prev => {
            const newSettings = { ...prev, [key]: value };

            if (key === 'instrument') {
                const instrument = value as WritingInstrument;
                if (instrument === 'pen') {
                    return { ...newSettings, fontFamily: 'Caveat', color: '#1a3a6b', thickness: 500 };
                }
                if (instrument === 'pencil') {
                    return { ...newSettings, fontFamily: 'Kalam', color: '#4a4a4a', thickness: 300 };
                }
                if (instrument === 'marker') {
                    return { ...newSettings, fontFamily: 'Permanent Marker', color: '#111111', thickness: 700 };
                }
            }
            return newSettings;
        });
    }, []);
    
    const handleGenerateText = async (prompt: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const generatedText = await generateTextFromPrompt(prompt);
            setText(generatedText);
        } catch (e) {
            setError('Failed to generate text. Please try again.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnalyzeStyle = async (imageData: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const styleSettings = await analyzeHandwritingStyle(imageData);
            setSettings(prev => ({
                ...prev,
                ...styleSettings,
                instrument: 'custom',
            }));
        } catch (e) {
             setError('Failed to analyze handwriting. Please try a clearer image.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-4">
                    <header className="w-full py-6 flex justify-center items-center">
                        <h1 className="text-3xl font-bold text-sky-700 tracking-tight">ScribbleForge</h1>
                    </header>
                    <p className="text-slate-500 mt-1">Transform text into realistic handwriting.</p>
                </div>
            </header>
            <main className="container mx-auto p-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4">
                        <ControlsPanel
                            text={text}
                            setText={setText}
                            settings={settings}
                            onSettingsChange={handleSettingsChange}
                            onGenerateText={handleGenerateText}
                            onAnalyzeStyle={handleAnalyzeStyle}
                            isLoading={isLoading}
                            error={error}
                            setIsLoading={setIsLoading}
                        />
                    </div>
                    <div className="lg:col-span-8">
                        <PreviewPanel 
                            text={text} 
                            settings={settings}
                            previewRef={previewRef} 
                        />
                    </div>
                </div>
            </main>
            <footer className="text-center py-4 text-slate-500 text-sm">
                <p>Powered by React, Tailwind CSS, and Gemini API.</p>
            </footer>
        </div>
    );
};

export default App;