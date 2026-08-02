'use client';
import React, { useState, useEffect } from 'react';

// 1. Define the feed interface
interface FeedItem {
    id: number;
    author: string;
    date: string;
    title: string;
    description: string;
    imageUrl: string;
}

export default function Page() {
    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    
    // 2. Pass <FeedItem[]> to useState so TypeScript knows it's an array of FeedItems!
    const [data, setData] = useState<FeedItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('myData');
        if (saved) {
            try {
                setData(JSON.parse(saved));
            } catch (err) {
                console.error(err);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('myData', JSON.stringify(data));
        }
    }, [data, isLoaded]);

    const addData = () => {
        const currentDate = new Date().toLocaleDateString();
        
        // 3. Construct object conforming to FeedItem
        const newData: FeedItem = {
            id: data.length + 1,
            author,
            date: currentDate,
            title,
            description,
            imageUrl: imageUrl.trim() === "" 
                ? "https://media.geeksforgeeks.org/wp-content/uploads/20211213172224/1.png" 
                : imageUrl
        };
        
        // Now TypeScript knows both sides are FeedItem[] — red underline gone!
        setData([...data, newData]);
        setAuthor('');
        setTitle('');
        setDescription('');
        setImageUrl('');
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Create Feed</h1>
            
            {/* Replaced bg-light with dynamic CSS theme variables */}
            <div 
                className="p-6 rounded-lg border border-[var(--elementBorder)] bg-[var(--elementBg)] text-[var(--elementForeground)]"
                style={{ marginTop: '2rem' }}
            >
                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        className="p-2 rounded border border-[var(--elementBorder)] bg-[var(--background)] text-[var(--foreground)]"
                        placeholder="Author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                    <input
                        type="text"
                        className="p-2 rounded border border-[var(--elementBorder)] bg-[var(--background)] text-[var(--foreground)]"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        className="p-2 rounded border border-[var(--elementBorder)] bg-[var(--background)] text-[var(--foreground)]"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <input
                        type="text"
                        className="p-2 rounded border border-[var(--elementBorder)] bg-[var(--background)] text-[var(--foreground)]"
                        placeholder="Image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                    <button 
                        onClick={addData} 
                        className="mt-2 px-4 py-2 bg-purple-700 text-white font-medium rounded hover:bg-purple-800 transition-colors"
                    >
                        Add Data
                    </button>
                </div>
            </div>
        </div>
    );
}