import React from 'react';

const ArticleCard: React.FC<{ title: string; summary: string; }> = ({ title, summary }) => (
    <div className="bg-gray-800/50 p-6 rounded-lg hover:bg-gray-700/50 hover:ring-2 hover:ring-sky-500/50 transition-all cursor-pointer">
        <h3 className="text-xl font-bold text-sky-300 mb-2">{title}</h3>
        <p className="text-gray-400">{summary}</p>
    </div>
);

const LearningCenter: React.FC = () => {
    const articles = [
        {
            title: "Understanding the Rock Cycle",
            summary: "Learn about the three main types of rocks—igneous, sedimentary, and metamorphic—and the processes that transform them."
        },
        {
            title: "A Guide to the Mohs Hardness Scale",
            summary: "Discover how to test mineral hardness using the Mohs scale, a key tool for field identification."
        },
        {
            title: "Identifying Common Minerals",
            summary: "An introduction to identifying common minerals like quartz, feldspar, and calcite based on their physical properties."
        },
        {
            title: "What are Geodes?",
            summary: "Explore the fascinating world of geodes. Learn how these hollow rocks form and what treasures they might hold inside."
        },
        {
            title: "Safety Tips for Rockhounding",
            summary: "Before you head out, review these essential safety tips for a successful and safe rockhounding adventure."
        }
    ];

    return (
        <div className="h-full overflow-y-auto p-4 sm:p-6 bg-gray-900 animate-fade-in">
            <div className="container mx-auto max-w-4xl">
                <div className="mb-8 text-center">
                    <h2 className="text-4xl font-bold text-gray-100">Geology Learning Center</h2>
                    <p className="text-lg text-gray-400 mt-2">Expand your knowledge and become a rock-hounding expert!</p>
                </div>
                <div className="space-y-6">
                    {articles.map((article, index) => (
                        <ArticleCard key={index} title={article.title} summary={article.summary} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LearningCenter;