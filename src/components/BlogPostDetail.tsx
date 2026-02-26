import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Twitter, Linkedin, Youtube, Instagram, CheckCircle } from 'lucide-react';

interface BlogPostDetailProps {
  post: any;
  onBack: () => void;
  relatedPosts: any[];
  onSelectPost: (post: any) => void;
}

export default function BlogPostDetail({ post, onBack, relatedPosts, onSelectPost }: BlogPostDetailProps) {
  // Mock content for the blog post
  const mockContent = (
    <div className="prose prose-invert prose-lg max-w-none">
      <p className="text-xl text-gray-300 leading-relaxed mb-8">
        {post.excerpt}
      </p>
      
      <h2 className="text-3xl font-bold text-white mt-12 mb-6">Unrealistic expectations</h2>
      <p className="text-gray-400 leading-relaxed mb-6">
        One of the biggest roadblocks to successful business automation is setting unrealistic expectations. Many founders believe that implementing a new software tool will magically solve all their operational problems overnight. The reality is that automation requires careful planning, testing, and iteration.
      </p>
      <p className="text-gray-400 leading-relaxed mb-8">
        When expectations don't align with reality, teams become frustrated, and automation initiatives are often abandoned before they have a chance to deliver real value.
      </p>

      <h2 className="text-3xl font-bold text-white mt-12 mb-6">Inadequate planning</h2>
      <p className="text-gray-400 leading-relaxed mb-6">
        Jumping straight into automation without a clear strategy is a recipe for disaster. You need to map out your existing processes, identify bottlenecks, and determine exactly what needs to be automated and why.
      </p>
      
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 my-10">
        <h3 className="text-xl font-bold text-white mb-4">Key Takeaway</h3>
        <p className="text-indigo-300 italic">
          "Systemize the routine, humanize the exception. Don't try to automate processes that require empathy, creativity, or complex decision-making."
        </p>
      </div>

      <h2 className="text-3xl font-bold text-white mt-12 mb-6">Resistance to change</h2>
      <p className="text-gray-400 leading-relaxed mb-6">
        Even the best automation systems will fail if your team refuses to use them. Change management is a critical component of any automation initiative. You must communicate the benefits clearly and provide adequate training.
      </p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={onBack}
        className="mb-12 flex items-center gap-2 text-gray-400 hover:text-white transition group"
      >
        <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span className="font-medium">Back to Blog</span>
      </button>

      {/* Article Header (Full Width) */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8 text-sm font-medium text-gray-400">
          <span>{post.readTime}</span>
          <div className="flex items-center gap-3">
            <img 
              src="https://i.pravatar.cc/150?img=11" 
              alt="Brahian Beltran" 
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-white">Brahian Beltran</span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] max-w-4xl">
          {post.title}
        </h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-12 lg:gap-16">
        {/* Main Content Column */}
        <div className="min-w-0">
          
          <div className="w-full aspect-[16/10] rounded-3xl overflow-hidden mb-12 border border-white/10">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Body */}
          <div className="mb-16">
            {mockContent}
          </div>

          {/* Post Category */}
          <div className="flex items-center justify-between border-t border-white/10 pt-8 mb-16">
            <h3 className="text-xl font-bold text-white">Post Category</h3>
            <span className="px-6 py-2 rounded-full border border-indigo-500/30 text-indigo-400 text-sm font-medium bg-indigo-500/10 hover:bg-indigo-500/20 transition cursor-pointer">
              {post.category}
            </span>
          </div>

          {/* Author Bio Box */}
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
            <img 
              src="https://i.pravatar.cc/150?img=11" 
              alt="Brahian Beltran" 
              className="w-24 h-24 rounded-full object-cover border-4 border-[#1a1a1a]"
            />
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Brahian Beltran</h3>
              <p className="text-indigo-400 font-medium mb-4">Founder & CEO</p>
              <p className="text-gray-400 leading-relaxed">
                I've built a sustainable personal brand along with a thriving community of fans over the past 14 years and 4 companies. My mission is to help 100 million founders build beautiful and systemized businesses so that they can achieve their dreams. I help you create and scale your personal brand and business through repeatable systems so that your company serves you, instead of the other way around.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:border-l lg:border-white/10 lg:pl-12">
          <div className="sticky top-24 space-y-12">
            
            {/* Table of Contents */}
            <div className="bg-white rounded-3xl p-8 text-black">
              <h3 className="text-2xl font-bold mb-6">Table of Contents</h3>
              <ul className="space-y-4 text-gray-700 font-medium">
                <li className="hover:text-black cursor-pointer transition">Unrealistic expectations</li>
                <li className="hover:text-black cursor-pointer transition">Inadequate planning</li>
                <li className="hover:text-black cursor-pointer transition">Resistance to change</li>
                <li className="hover:text-black cursor-pointer transition">Poor integration with existing systems</li>
                <li className="hover:text-black cursor-pointer transition">Insufficient training and support</li>
                <li className="hover:text-black cursor-pointer transition">Making automation work long-term</li>
              </ul>
            </div>

            {/* Newsletter & Socials */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Get the CreatorMatch Newsletter:</h3>
              <p className="text-gray-400 mb-6">
                The personal brand tips and audience growth systems that worked for me.
              </p>
              <button className="w-full bg-[#d4ff32] hover:bg-[#c2eb2e] text-black font-bold py-4 px-6 rounded-xl transition-colors mb-8 uppercase tracking-wider text-sm">
                Get the Framework
              </button>

              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Related Articles */}
      <div className="mt-24 pt-16 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold text-white mb-4">Related articles</h2>
            <p className="text-gray-400">
              Get access to our guides, playbooks, and blueprints for growing your business
            </p>
          </div>
          <button className="bg-[#d4ff32] hover:bg-[#c2eb2e] text-black font-bold py-3 px-8 rounded-xl transition-colors uppercase tracking-wider text-sm">
            Read More
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedPosts.slice(0, 3).map(relatedPost => (
            <div 
              key={relatedPost.id} 
              className="group cursor-pointer flex flex-col h-full bg-[#111111] rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onSelectPost(relatedPost);
              }}
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={relatedPost.image} 
                  alt={relatedPost.title} 
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {relatedPost.title}
                </h4>
                <p className="text-gray-400 text-sm line-clamp-2 mt-auto">
                  {relatedPost.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
