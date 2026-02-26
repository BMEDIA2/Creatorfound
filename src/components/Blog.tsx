import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, Clock, ChevronRight, User } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogProps {
  blogPosts: BlogPost[];
}

const CATEGORIES = ['All', 'Growth', 'Hiring', 'Design', 'Monetization', 'Business'];

export default function Blog({ blogPosts }: BlogProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const featuredPost = blogPosts[0]; // For now, just take the first one as featured
  const recentPosts = blogPosts.filter(p => p.id !== featuredPost?.id && (activeCategory === 'All' || p.category === activeCategory));

  if (selectedPost) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto px-4 py-12">
        <button 
          onClick={() => setSelectedPost(null)} 
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Articles
        </button>

        <article>
          {/* Article Header */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400 mb-6">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full font-medium uppercase tracking-wider text-xs">
                {selectedPost.category}
              </span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {selectedPost.readTime}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {selectedPost.date}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              {selectedPost.title}
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                <img src={selectedPost.authorAvatar} alt={selectedPost.author} className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <div className="text-white font-medium">{selectedPost.author}</div>
                <div className="text-gray-500 text-xs">Author</div>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          {selectedPost.coverImage && (
            <div className="rounded-3xl overflow-hidden mb-16 border border-white/10 shadow-2xl">
              <img src={selectedPost.coverImage} alt={selectedPost.title} className="w-full h-auto object-cover" referrerPolicy="no-referrer" />
            </div>
          )}

          {/* Article Content Blocks */}
          <div className="space-y-8 text-lg text-gray-300 leading-relaxed">
            {selectedPost.blocks.map(block => {
              switch (block.type) {
                case 'paragraph':
                  return <p key={block.id} className="mb-6">{block.content}</p>;
                case 'h1':
                  return <h1 key={block.id} className="text-4xl font-bold text-white mt-12 mb-6">{block.content}</h1>;
                case 'h2':
                  return <h2 key={block.id} className="text-3xl font-bold text-white mt-12 mb-6">{block.content}</h2>;
                case 'h3':
                  return <h3 key={block.id} className="text-2xl font-bold text-white mt-8 mb-4">{block.content}</h3>;
                case 'quote':
                  return (
                    <blockquote key={block.id} className="border-l-4 border-indigo-500 pl-6 py-2 my-8 italic text-xl text-white bg-white/5 rounded-r-xl">
                      "{block.content}"
                    </blockquote>
                  );
                case 'image':
                  return (
                    <figure key={block.id} className="my-12">
                      <div className="rounded-2xl overflow-hidden border border-white/10">
                        <img src={block.content} alt={block.caption || 'Article image'} className="w-full h-auto" referrerPolicy="no-referrer" />
                      </div>
                      {block.caption && <figcaption className="text-center text-sm text-gray-500 mt-3">{block.caption}</figcaption>}
                    </figure>
                  );
                case 'list':
                  return (
                    <div key={block.id} className="flex items-start gap-3 mb-4 pl-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0"></div>
                      <p>{block.content}</p>
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
        </article>

        {/* Footer / Newsletter */}
        <div className="mt-20 pt-12 border-t border-white/10">
          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-4">Enjoyed this article?</h3>
              <p className="text-gray-300 mb-6">Subscribe to our newsletter for more insights.</p>
              <form className="flex gap-2 max-w-sm mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Email address" className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                <button className="btn-primary px-6 py-2 rounded-xl font-bold text-white">Join</button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Creator Insights</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Strategies, tactics, and stories from top creators and the professionals who help them scale.
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
                : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#252525] border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Post */}
      {activeCategory === 'All' && featuredPost && (
        <div onClick={() => setSelectedPost(featuredPost)} className="mb-20 group cursor-pointer">
          <div className="grid md:grid-cols-2 gap-8 items-center bg-[#111111] rounded-3xl overflow-hidden border border-white/5 hover:border-white/10 transition-all">
            <div className="h-full min-h-[300px] md:min-h-[400px] relative overflow-hidden">
              <img 
                src={featuredPost.coverImage} 
                alt={featuredPost.title} 
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider rounded-full">
                  {featuredPost.category}
                </span>
                <span className="text-gray-500 text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {featuredPost.readTime}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-gray-400 text-lg mb-8 line-clamp-3">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                    <img src={featuredPost.authorAvatar} alt={featuredPost.author} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{featuredPost.author}</div>
                    <div className="text-gray-500 text-xs">{featuredPost.date}</div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Posts Grid */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          {activeCategory === 'All' ? 'Latest Articles' : `${activeCategory} Articles`}
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map(post => (
            <div key={post.id} onClick={() => setSelectedPost(post)} className="group cursor-pointer flex flex-col h-full">
              <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full border border-white/10">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.readTime}</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-gray-400 mb-6 line-clamp-2 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
                  <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                    <img src={post.authorAvatar} alt={post.author} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-gray-300 text-sm font-medium">{post.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="mt-24 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-full bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get the latest insights delivered weekly</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join 10,000+ creators and professionals who receive our best strategies for growth and hiring.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
              required
            />
            <button type="submit" className="btn-primary px-6 py-3 rounded-xl font-bold text-white whitespace-nowrap">
              Subscribe
            </button>
          </form>
          <p className="text-gray-500 text-xs mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </motion.div>
  );
}
