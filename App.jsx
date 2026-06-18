import React, { useState, useMemo } from "react";

// ════════════════════════════════════════════════════════════════════
//  LAUNCHRADAR — Full MVP
//  Find your first 100 users in 60 seconds.
//
//  This is a complete, working app. Channel data is embedded below so it
//  runs immediately with no backend. When you're ready to go live:
//   • Move CHANNELS into a Supabase 'channels' table (see build doc Sec 8)
//   • Replace the embedded array with a Supabase fetch
//   • Wire the "Unlock" button to a Stripe Checkout link (see build doc Sec 9)
//  Every integration point is marked with  // 👉 PLUG-IN POINT
// ════════════════════════════════════════════════════════════════════

const CHANNELS = [{"id":1,"name":"Product Hunt","category":"Launch Platform","url":"producthunt.com","cost":"Free","traffic":95,"ease":40,"rel_saas":95,"rel_ai":95,"rel_os":80,"rel_mobile":85,"rel_news":70,"difficulty":"High","audience":"Founders/Builders","est":"100-2000","notes":"Launch Tue-Thu. Hunter with following helps. Golden Kitty awards drive spikes."},{"id":2,"name":"Hacker News Show HN","category":"Launch Platform","url":"news.ycombinator.com","cost":"Free","traffic":90,"ease":50,"rel_saas":85,"rel_ai":80,"rel_os":95,"rel_mobile":70,"rel_news":60,"difficulty":"High","audience":"Developers/Founders","est":"50-5000","notes":"Show HN posts on weekdays. Technical depth required. Comments drive discovery."},{"id":3,"name":"BetaList","category":"Launch Platform","url":"betalist.com","cost":"Free/Paid","traffic":70,"ease":70,"rel_saas":85,"rel_ai":80,"rel_os":75,"rel_mobile":80,"rel_news":50,"difficulty":"Low","audience":"Early Adopters","est":"50-500","notes":"Free tier slow (weeks). Paid ($129) gets featured fast. Good for email list building."},{"id":4,"name":"Uneed","category":"Launch Platform","url":"uneed.be","cost":"Free","traffic":60,"ease":85,"rel_saas":90,"rel_ai":90,"rel_os":70,"rel_mobile":75,"rel_news":60,"difficulty":"Low","audience":"Founders/Builders","est":"20-300","notes":"Daily launches. Fast approval. Good engagement-to-traffic ratio. Underrated."},{"id":5,"name":"Fazier","category":"Launch Platform","url":"fazier.com","cost":"Free","traffic":55,"ease":90,"rel_saas":85,"rel_ai":85,"rel_os":70,"rel_mobile":75,"rel_news":55,"difficulty":"Low","audience":"Founders/Builders","est":"10-200","notes":"Very easy to submit. Small but growing community. Good for SEO backlink."},{"id":6,"name":"MicroLaunch","category":"Launch Platform","url":"microlaunch.net","cost":"Free","traffic":55,"ease":85,"rel_saas":90,"rel_ai":80,"rel_os":70,"rel_mobile":70,"rel_news":60,"difficulty":"Low","audience":"Indie Hackers","est":"20-300","notes":"Curated for solo founders. Strong indie hacker crossover audience."},{"id":7,"name":"Peerlist Launchpad","category":"Launch Platform","url":"peerlist.io","cost":"Free","traffic":60,"ease":80,"rel_saas":80,"rel_ai":80,"rel_os":85,"rel_mobile":70,"rel_news":55,"difficulty":"Low","audience":"Developers","est":"20-400","notes":"Growing fast. Developer-first audience. LinkedIn alternative for tech."},{"id":8,"name":"DevHunt","category":"Launch Platform","url":"devhunt.org","cost":"Free","traffic":50,"ease":90,"rel_saas":70,"rel_ai":75,"rel_os":85,"rel_mobile":70,"rel_news":50,"difficulty":"Low","audience":"Developers","est":"10-200","notes":"Weekly launches. Very easy. Small audience but high signal."},{"id":9,"name":"Startup Stash","category":"Directory","url":"startupstash.com","cost":"Free","traffic":65,"ease":75,"rel_saas":80,"rel_ai":80,"rel_os":70,"rel_mobile":70,"rel_news":60,"difficulty":"Low","audience":"Founders","est":"10-100","notes":"Resource directory. Good SEO value. Permanent listing."},{"id":10,"name":"AlternativeTo","category":"Directory","url":"alternativeto.net","cost":"Free","traffic":85,"ease":60,"rel_saas":85,"rel_ai":80,"rel_os":80,"rel_mobile":80,"rel_news":55,"difficulty":"Medium","audience":"Consumers/Builders","est":"50-500","notes":"List as alternative to established competitors. SEO goldmine long-term."},{"id":11,"name":"SaaSHub","category":"Directory","url":"saashub.com","cost":"Free","traffic":70,"ease":70,"rel_saas":90,"rel_ai":75,"rel_os":70,"rel_mobile":65,"rel_news":55,"difficulty":"Low","audience":"Founders/Buyers","est":"20-200","notes":"Strong SEO. Good for B2B SaaS. Comparison-driven traffic."},{"id":12,"name":"Indie Hackers","category":"Community","url":"indiehackers.com","cost":"Free","traffic":80,"ease":65,"rel_saas":90,"rel_ai":85,"rel_os":80,"rel_mobile":70,"rel_news":80,"difficulty":"Medium","audience":"Indie Founders","est":"50-1000","notes":"Share product milestones. Milestone posts perform best. Avoid pure promotion."},{"id":13,"name":"r/SaaS","category":"Reddit","url":"reddit.com/r/saas","cost":"Free","traffic":85,"ease":55,"rel_saas":95,"rel_ai":80,"rel_os":70,"rel_mobile":65,"rel_news":60,"difficulty":"Medium","audience":"SaaS Founders","est":"20-500","notes":"Value-first posts. No spam. Share learnings + product. 100k+ members."},{"id":14,"name":"r/startups","category":"Reddit","url":"reddit.com/r/startups","cost":"Free","traffic":88,"ease":45,"rel_saas":85,"rel_ai":80,"rel_os":75,"rel_mobile":75,"rel_news":65,"difficulty":"High","audience":"Founders","est":"20-300","notes":"Strict rules. Feedback Friday thread is safest for promotion."},{"id":15,"name":"r/Entrepreneur","category":"Reddit","url":"reddit.com/r/Entrepreneur","cost":"Free","traffic":90,"ease":45,"rel_saas":80,"rel_ai":75,"rel_os":70,"rel_mobile":75,"rel_news":65,"difficulty":"High","audience":"Entrepreneurs","est":"20-500","notes":"Large audience. Promotional posts often downvoted. Success stories work."},{"id":16,"name":"r/SideProject","category":"Reddit","url":"reddit.com/r/SideProject","cost":"Free","traffic":75,"ease":70,"rel_saas":85,"rel_ai":85,"rel_os":85,"rel_mobile":80,"rel_news":70,"difficulty":"Low","audience":"Builders","est":"20-500","notes":"Very builder-friendly. Show What You Made posts perform well."},{"id":17,"name":"r/InternetIsBeautiful","category":"Reddit","url":"reddit.com/r/InternetIsBeautiful","cost":"Free","traffic":85,"ease":50,"rel_saas":70,"rel_ai":75,"rel_os":70,"rel_mobile":80,"rel_news":55,"difficulty":"Medium","audience":"General Public","est":"100-2000","notes":"Must be genuinely impressive/useful. High upside if it lands."},{"id":18,"name":"r/artificial","category":"Reddit","url":"reddit.com/r/artificial","cost":"Free","traffic":80,"ease":60,"rel_saas":60,"rel_ai":90,"rel_os":60,"rel_mobile":60,"rel_news":55,"difficulty":"Medium","audience":"AI Enthusiasts","est":"20-300","notes":"Strong for AI tools. Discussion-first community."},{"id":19,"name":"r/MachineLearning","category":"Reddit","url":"reddit.com/r/MachineLearning","cost":"Free","traffic":85,"ease":35,"rel_saas":50,"rel_ai":85,"rel_os":75,"rel_mobile":50,"rel_news":45,"difficulty":"High","audience":"ML Researchers","est":"10-200","notes":"Technical audience. Needs research backing or open source."},{"id":20,"name":"r/webdev","category":"Reddit","url":"reddit.com/r/webdev","cost":"Free","traffic":85,"ease":55,"rel_saas":70,"rel_ai":70,"rel_os":85,"rel_mobile":75,"rel_news":50,"difficulty":"Medium","audience":"Web Developers","est":"20-400","notes":"Show your work posts. Technical focus."},{"id":21,"name":"r/nocode","category":"Reddit","url":"reddit.com/r/nocode","cost":"Free","traffic":65,"ease":70,"rel_saas":80,"rel_ai":80,"rel_os":70,"rel_mobile":75,"rel_news":60,"difficulty":"Low","audience":"No-Code Builders","est":"10-200","notes":"Small but targeted. Good for no-code adjacent products."},{"id":22,"name":"r/ChatGPT","category":"Reddit","url":"reddit.com/r/ChatGPT","cost":"Free","traffic":95,"ease":40,"rel_saas":55,"rel_ai":95,"rel_os":55,"rel_mobile":60,"rel_news":55,"difficulty":"High","audience":"AI Users","est":"50-500","notes":"Massive. Hard to stand out. AI tool demos work if genuinely impressive."},{"id":23,"name":"r/ClaudeAI","category":"Reddit","url":"reddit.com/r/ClaudeAI","cost":"Free","traffic":70,"ease":60,"rel_saas":50,"rel_ai":90,"rel_os":60,"rel_mobile":55,"rel_news":50,"difficulty":"Medium","audience":"AI Users","est":"10-200","notes":"Claude-focused audience. Good for AI productivity tools."},{"id":24,"name":"r/ProductManagement","category":"Reddit","url":"reddit.com/r/ProductManagement","cost":"Free","traffic":75,"ease":55,"rel_saas":75,"rel_ai":70,"rel_os":65,"rel_mobile":65,"rel_news":65,"difficulty":"Medium","audience":"PMs","est":"10-200","notes":"PM-focused. Good for B2B SaaS targeting product teams."},{"id":25,"name":"r/smallbusiness","category":"Reddit","url":"reddit.com/r/smallbusiness","cost":"Free","traffic":80,"ease":55,"rel_saas":75,"rel_ai":70,"rel_os":65,"rel_mobile":70,"rel_news":60,"difficulty":"Medium","audience":"SMB Owners","est":"20-300","notes":"Good for SMB-focused tools. Community is solution-seeking."},{"id":26,"name":"r/marketing","category":"Reddit","url":"reddit.com/r/marketing","cost":"Free","traffic":80,"ease":50,"rel_saas":75,"rel_ai":70,"rel_os":60,"rel_mobile":65,"rel_news":70,"difficulty":"Medium","audience":"Marketers","est":"20-300","notes":"Good if your tool solves a marketing problem. Share results."},{"id":27,"name":"r/freelance","category":"Reddit","url":"reddit.com/r/freelance","cost":"Free","traffic":70,"ease":60,"rel_saas":70,"rel_ai":65,"rel_os":60,"rel_mobile":65,"rel_news":60,"difficulty":"Medium","audience":"Freelancers","est":"10-200","notes":"Niche but targeted for freelancer-focused SaaS."},{"id":28,"name":"r/SEO","category":"Reddit","url":"reddit.com/r/SEO","cost":"Free","traffic":80,"ease":55,"rel_saas":70,"rel_ai":65,"rel_os":65,"rel_mobile":60,"rel_news":65,"difficulty":"Medium","audience":"SEO Practitioners","est":"10-200","notes":"Focused audience. Tool reviews welcomed if genuinely useful."},{"id":29,"name":"r/LifeProTips","category":"Reddit","url":"reddit.com/r/LifeProTips","cost":"Free","traffic":90,"ease":35,"rel_saas":60,"rel_ai":70,"rel_os":60,"rel_mobile":70,"rel_news":55,"difficulty":"High","audience":"General Public","est":"50-1000","notes":"Must be disguised as a tip"},{"id":30,"name":"r/productivity","category":"Reddit","url":"reddit.com/r/productivity","cost":"Free","traffic":85,"ease":55,"rel_saas":70,"rel_ai":80,"rel_os":65,"rel_mobile":75,"rel_news":70,"difficulty":"Medium","audience":"Productivity Seekers","est":"20-400","notes":"Good for AI productivity tools. Community is solution-hungry."},{"id":31,"name":"TLDR Newsletter","category":"Newsletter","url":"tldr.tech","cost":"Paid","traffic":95,"ease":20,"rel_saas":85,"rel_ai":90,"rel_os":80,"rel_mobile":70,"rel_news":65,"difficulty":"Very High","audience":"Developers/Founders","est":"1000-10000","notes":"Sponsorship ~$500-2000. High ROI for right product. Massive reach."},{"id":32,"name":"Ben's Bites","category":"Newsletter","url":"bensbites.com","cost":"Paid","traffic":80,"ease":25,"rel_saas":60,"rel_ai":95,"rel_os":65,"rel_mobile":60,"rel_news":60,"difficulty":"Very High","audience":"AI Enthusiasts","est":"500-5000","notes":"AI-specific. 100k+ subscribers. Sponsorship or organic mention."},{"id":33,"name":"The Rundown AI","category":"Newsletter","url":"therundown.ai","cost":"Paid","traffic":85,"ease":20,"rel_saas":55,"rel_ai":95,"rel_os":60,"rel_mobile":55,"rel_news":60,"difficulty":"Very High","audience":"AI Users","est":"1000-10000","notes":"1M+ subscribers. Very competitive for sponsorship. High impact if featured."},{"id":34,"name":"Lenny's Newsletter","category":"Newsletter","url":"lennysnewsletter.com","cost":"Paid","traffic":85,"ease":15,"rel_saas":75,"rel_ai":70,"rel_os":65,"rel_mobile":65,"rel_news":70,"difficulty":"Very High","audience":"PMs/Founders","est":"500-5000","notes":"Premium audience. Sponsorship expensive. Organic mention rare but valuable."},{"id":35,"name":"Indie Hackers Newsletter","category":"Newsletter","url":"indiehackers.com/newsletter","cost":"Free","traffic":70,"ease":55,"rel_saas":90,"rel_ai":85,"rel_os":80,"rel_mobile":70,"rel_news":80,"difficulty":"Medium","audience":"Indie Founders","est":"200-2000","notes":"Submit product for feature. Aligned audience."},{"id":36,"name":"Product Hunt Newsletter","category":"Newsletter","url":"producthunt.com","cost":"Free","traffic":80,"ease":50,"rel_saas":85,"rel_ai":85,"rel_os":75,"rel_mobile":80,"rel_news":65,"difficulty":"Medium","audience":"Builders/Early Adopters","est":"200-2000","notes":"Automated from PH launch. Requires successful PH listing."},{"id":37,"name":"SaaS Weekly","category":"Newsletter","url":"saasweekly.io","cost":"Paid","traffic":55,"ease":35,"rel_saas":90,"rel_ai":70,"rel_os":65,"rel_mobile":60,"rel_news":70,"difficulty":"High","audience":"SaaS Founders","est":"200-1000","notes":"Targeted SaaS founder readership. Smaller but very aligned."},{"id":38,"name":"Unreadit/SaaS","category":"Newsletter","url":"unreadit.com","cost":"Free","traffic":40,"ease":75,"rel_saas":80,"rel_ai":70,"rel_os":65,"rel_mobile":60,"rel_news":65,"difficulty":"Low","audience":"SaaS Founders","est":"100-500","notes":"Aggregates top Reddit SaaS posts. Submit your Reddit post."},{"id":39,"name":"No Code Founders Newsletter","category":"Newsletter","url":"nocodefounders.com","cost":"Free/Paid","traffic":45,"ease":60,"rel_saas":75,"rel_ai":75,"rel_os":70,"rel_mobile":70,"rel_news":70,"difficulty":"Medium","audience":"No-Code Builders","est":"100-500","notes":"Targeted no-code audience."},{"id":40,"name":"The SaaS Bootstrapper","category":"Newsletter","url":"thesaasbootstrapper.com","cost":"Free","traffic":40,"ease":65,"rel_saas":85,"rel_ai":70,"rel_os":70,"rel_mobile":65,"rel_news":70,"difficulty":"Medium","audience":"Bootstrappers","est":"100-500","notes":"Community-driven content. Good for milestone shares."},{"id":41,"name":"Futurepedia","category":"Directory","url":"futurepedia.io","cost":"Free","traffic":85,"ease":70,"rel_saas":65,"rel_ai":95,"rel_os":60,"rel_mobile":65,"rel_news":55,"difficulty":"Low","audience":"AI Users","est":"50-500","notes":"Largest AI tool directory. Must-submit for any AI product. SEO value high."},{"id":42,"name":"Toolify","category":"Directory","url":"toolify.ai","cost":"Free","traffic":75,"ease":75,"rel_saas":60,"rel_ai":95,"rel_os":60,"rel_mobile":60,"rel_news":55,"difficulty":"Low","audience":"AI Users","est":"30-300","notes":"Free submission. Good SEO. AI-specific directory."},{"id":43,"name":"AI Tool Hunt","category":"Directory","url":"aitoolforsales.com","cost":"Free","traffic":60,"ease":80,"rel_saas":60,"rel_ai":90,"rel_os":60,"rel_mobile":60,"rel_news":50,"difficulty":"Low","audience":"AI Users","est":"20-200","notes":"Easy to list. Growing audience."},{"id":44,"name":"TopAI.Tools","category":"Directory","url":"topai.tools","cost":"Free","traffic":70,"ease":75,"rel_saas":60,"rel_ai":92,"rel_os":60,"rel_mobile":60,"rel_news":55,"difficulty":"Low","audience":"AI Users","est":"30-300","notes":"Curated AI tools. Good organic traffic."},{"id":45,"name":"There's An AI For That","category":"Directory","url":"theresanaiforthat.com","cost":"Free","traffic":80,"ease":70,"rel_saas":60,"rel_ai":95,"rel_os":60,"rel_mobile":60,"rel_news":55,"difficulty":"Low","audience":"AI Users","est":"50-500","notes":"High traffic AI directory. Must for AI tools. SEO backlink."},{"id":46,"name":"AI Valley","category":"Directory","url":"aivalley.ai","cost":"Free","traffic":60,"ease":80,"rel_saas":60,"rel_ai":90,"rel_os":60,"rel_mobile":55,"rel_news":55,"difficulty":"Low","audience":"AI Users","est":"20-200","notes":"Free listing. Less crowded than top directories."},{"id":47,"name":"Toolpilot","category":"Directory","url":"toolpilot.ai","cost":"Free","traffic":65,"ease":80,"rel_saas":60,"rel_ai":90,"rel_os":60,"rel_mobile":60,"rel_news":55,"difficulty":"Low","audience":"AI Users","est":"20-300","notes":"Good SEO. Easy submission."},{"id":48,"name":"EasyWithAI","category":"Directory","url":"easywith.ai","cost":"Free","traffic":55,"ease":85,"rel_saas":60,"rel_ai":88,"rel_os":60,"rel_mobile":60,"rel_news":50,"difficulty":"Low","audience":"AI Users","est":"10-200","notes":"Very easy submission. Smaller traffic."},{"id":49,"name":"GPT Store","category":"Directory","url":"chat.openai.com/gpts","cost":"Free","traffic":95,"ease":60,"rel_saas":50,"rel_ai":95,"rel_os":50,"rel_mobile":55,"rel_news":50,"difficulty":"Medium","audience":"AI/ChatGPT Users","est":"100-5000","notes":"Only for GPT-based tools. Huge traffic potential but discovery algorithm opaque."},{"id":50,"name":"Product Hunt Upcoming","category":"Launch Platform","url":"producthunt.com/upcoming","cost":"Free","traffic":90,"ease":65,"rel_saas":85,"rel_ai":85,"rel_os":75,"rel_mobile":80,"rel_news":65,"difficulty":"Low","audience":"Early Adopters","est":"50-500","notes":"Build pre-launch waitlist. Collects emails before full launch."},{"id":51,"name":"Startups.com","category":"Directory","url":"startups.com","cost":"Free","traffic":65,"ease":60,"rel_saas":80,"rel_ai":70,"rel_os":70,"rel_mobile":70,"rel_news":60,"difficulty":"Medium","audience":"Founders","est":"10-100","notes":"Resource hub. Listing provides credibility signal."},{"id":52,"name":"Crunchbase","category":"Directory","url":"crunchbase.com","cost":"Free","traffic":90,"ease":55,"rel_saas":75,"rel_ai":70,"rel_os":75,"rel_mobile":70,"rel_news":60,"difficulty":"Medium","audience":"Investors/Press","est":"5-50","notes":"Credibility more than traffic. Good for press outreach."},{"id":53,"name":"AngelList/Wellfound","category":"Directory","url":"wellfound.com","cost":"Free","traffic":80,"ease":55,"rel_saas":75,"rel_ai":70,"rel_os":75,"rel_mobile":70,"rel_news":60,"difficulty":"Medium","audience":"Founders/Investors","est":"5-100","notes":"Talent + investor visibility. Lower direct user traffic."},{"id":54,"name":"G2","category":"Directory","url":"g2.com","cost":"Free","traffic":90,"ease":40,"rel_saas":85,"rel_ai":75,"rel_os":70,"rel_mobile":65,"rel_news":55,"difficulty":"High","audience":"Business Buyers","est":"20-500","notes":"Review platform. SEO monster. Hard to get first reviews but high value long-term."},{"id":55,"name":"Capterra","category":"Directory","url":"capterra.com","cost":"Free/Paid","traffic":85,"ease":40,"rel_saas":80,"rel_ai":70,"rel_os":65,"rel_mobile":65,"rel_news":55,"difficulty":"High","audience":"SMB Buyers","est":"20-500","notes":"Similar to G2. Good for SMB-targeting SaaS."},{"id":56,"name":"GetApp","category":"Directory","url":"getapp.com","cost":"Free","traffic":75,"ease":45,"rel_saas":75,"rel_ai":65,"rel_os":60,"rel_mobile":60,"rel_news":55,"difficulty":"High","audience":"Business Buyers","est":"10-200","notes":"Gartner product. Good SEO. Overlaps with Capterra."},{"id":57,"name":"SourceForge","category":"Directory","url":"sourceforge.net","cost":"Free","traffic":80,"ease":55,"rel_saas":50,"rel_ai":60,"rel_os":90,"rel_mobile":60,"rel_news":40,"difficulty":"Low","audience":"Developers","est":"20-500","notes":"Essential for open source. Less relevant for pure SaaS."},{"id":58,"name":"GitHub Trending","category":"Community","url":"github.com/trending","cost":"Free","traffic":95,"ease":30,"rel_saas":55,"rel_ai":70,"rel_os":95,"rel_mobile":65,"rel_news":40,"difficulty":"Very High","audience":"Developers","est":"100-10000","notes":"Cannot submit — must earn trending organically. Requires stars/momentum."},{"id":59,"name":"GitLab","category":"Directory","url":"gitlab.com","cost":"Free","traffic":80,"ease":50,"rel_saas":50,"rel_ai":65,"rel_os":90,"rel_mobile":60,"rel_news":40,"difficulty":"Medium","audience":"Developers","est":"10-200","notes":"Mirror or host project. Less discovery than GitHub."},{"id":60,"name":"F6S","category":"Directory","url":"f6s.com","cost":"Free","traffic":65,"ease":65,"rel_saas":75,"rel_ai":65,"rel_os":65,"rel_mobile":65,"rel_news":55,"difficulty":"Low","audience":"Founders","est":"5-100","notes":"Startup community. Good for accelerator applications too."},{"id":61,"name":"Slant.co","category":"Directory","url":"slant.co","cost":"Free","traffic":65,"ease":65,"rel_saas":70,"rel_ai":70,"rel_os":70,"rel_mobile":70,"rel_news":55,"difficulty":"Low","audience":"Consumers","est":"10-100","notes":"Comparison site. List your product as option in relevant categories."},{"id":62,"name":"SideProjectors","category":"Directory","url":"sideprojectors.com","cost":"Free","traffic":50,"ease":75,"rel_saas":80,"rel_ai":75,"rel_os":75,"rel_mobile":75,"rel_news":65,"difficulty":"Low","audience":"Indie Builders","est":"10-100","notes":"Dedicated to side projects. Small but aligned audience."},{"id":63,"name":"Maker's Kitchen","category":"Community","url":"makerskitchen.io","cost":"Free","traffic":40,"ease":80,"rel_saas":80,"rel_ai":80,"rel_os":75,"rel_mobile":70,"rel_news":65,"difficulty":"Low","audience":"Indie Builders","est":"5-100","notes":"Early community. High engagement per post."},{"id":64,"name":"The Indie Hackers Forum","category":"Community","url":"indiehackers.com/forum","cost":"Free","traffic":75,"ease":65,"rel_saas":88,"rel_ai":83,"rel_os":78,"rel_mobile":68,"rel_news":78,"difficulty":"Low","audience":"Indie Founders","est":"20-300","notes":"Share what you built thread. Community very supportive."},{"id":65,"name":"WIP.co","category":"Community","url":"wip.co","cost":"Paid","traffic":50,"ease":70,"rel_saas":80,"rel_ai":80,"rel_os":80,"rel_mobile":70,"rel_news":65,"difficulty":"Low","audience":"Makers","est":"10-200","notes":"Accountability + maker community. $20/month. Niche but high quality."},{"id":66,"name":"Makerlog","category":"Community","url":"getmakerlog.com","cost":"Free","traffic":45,"ease":80,"rel_saas":80,"rel_ai":80,"rel_os":80,"rel_mobile":70,"rel_news":65,"difficulty":"Low","audience":"Makers","est":"5-100","notes":"Daily progress logs. Maker community. Small but dedicated."},{"id":67,"name":"Designer News","category":"Community","url":"designernews.co","cost":"Free","traffic":65,"ease":60,"rel_saas":65,"rel_ai":65,"rel_os":65,"rel_mobile":70,"rel_news":55,"difficulty":"Medium","audience":"Designers","est":"10-200","notes":"Good for design-adjacent tools. Less relevant for pure SaaS."},{"id":68,"name":"Lobsters","category":"Community","url":"lobste.rs","cost":"Free","traffic":65,"ease":40,"rel_saas":55,"rel_ai":60,"rel_os":85,"rel_mobile":60,"rel_news":45,"difficulty":"High","audience":"Developers","est":"10-300","notes":"Invite-only to post. Technical audience. High quality discussions."},{"id":69,"name":"LinkedIn Newsletter","category":"Newsletter","url":"linkedin.com","cost":"Free","traffic":90,"ease":60,"rel_saas":80,"rel_ai":80,"rel_os":70,"rel_mobile":70,"rel_news":80,"difficulty":"Medium","audience":"Professionals","est":"100-5000","notes":"Build your own. Subscriber notifications strong. Founder storytelling works."},{"id":70,"name":"LinkedIn Posts (Founder)","category":"Community","url":"linkedin.com","cost":"Free","traffic":90,"ease":65,"rel_saas":80,"rel_ai":80,"rel_os":70,"rel_mobile":70,"rel_news":80,"difficulty":"Medium","audience":"Professionals","est":"50-2000","notes":"Document building process. Milestone posts. Tag relevant people."},{"id":71,"name":"LinkedIn Groups - SaaS","category":"Community","url":"linkedin.com/groups","cost":"Free","traffic":70,"ease":55,"rel_saas":80,"rel_ai":70,"rel_os":65,"rel_mobile":65,"rel_news":70,"difficulty":"Medium","audience":"SaaS Professionals","est":"10-200","notes":"Many groups are quiet. Find active ones. Check engagement before posting."},{"id":72,"name":"LinkedIn Groups - AI Tools","category":"Community","url":"linkedin.com/groups","cost":"Free","traffic":70,"ease":55,"rel_saas":60,"rel_ai":85,"rel_os":60,"rel_mobile":60,"rel_news":65,"difficulty":"Medium","audience":"AI Professionals","est":"10-200","notes":"Targeted AI professional audience."},{"id":73,"name":"X (Twitter) #buildinpublic","category":"Community","url":"x.com","cost":"Free","traffic":90,"ease":65,"rel_saas":85,"rel_ai":85,"rel_os":80,"rel_mobile":75,"rel_news":75,"difficulty":"Medium","audience":"Builders","est":"20-2000","notes":"Document journey. Consistent posting. Community is very supportive of builders."},{"id":74,"name":"X (Twitter) #indiehackers","category":"Community","url":"x.com","cost":"Free","traffic":85,"ease":65,"rel_saas":88,"rel_ai":83,"rel_os":78,"rel_mobile":72,"rel_news":78,"difficulty":"Medium","audience":"Indie Founders","est":"20-1000","notes":"Strong hashtag community. Share milestones + revenue."},{"id":75,"name":"X (Twitter) #AItools","category":"Community","url":"x.com","cost":"Free","traffic":85,"ease":65,"rel_saas":55,"rel_ai":92,"rel_os":60,"rel_mobile":65,"rel_news":60,"difficulty":"Medium","audience":"AI Enthusiasts","est":"20-1000","notes":"High AI tool discovery. Demo videos perform well."},{"id":76,"name":"X (Twitter) Launch Threads","category":"Community","url":"x.com","cost":"Free","traffic":90,"ease":60,"rel_saas":80,"rel_ai":80,"rel_os":75,"rel_mobile":75,"rel_news":70,"difficulty":"Medium","audience":"Founders","est":"50-5000","notes":"Launch day thread. Tag relevant accounts. Engagement drives reach."},{"id":77,"name":"Facebook - SaaS Growth Hacks","category":"Community","url":"facebook.com/groups","cost":"Free","traffic":70,"ease":65,"rel_saas":85,"rel_ai":75,"rel_os":65,"rel_mobile":65,"rel_news":65,"difficulty":"Low","audience":"SaaS Founders","est":"10-200","notes":"Active group. Value-first posting. No spam tolerated."},{"id":78,"name":"Facebook - Indie Hackers","category":"Community","url":"facebook.com/groups","cost":"Free","traffic":60,"ease":70,"rel_saas":85,"rel_ai":80,"rel_os":72,"rel_mobile":68,"rel_news":72,"difficulty":"Low","audience":"Indie Founders","est":"10-150","notes":"Less active than IH forum but still worth submitting."},{"id":79,"name":"Facebook - AI Marketing","category":"Community","url":"facebook.com/groups","cost":"Free","traffic":65,"ease":65,"rel_saas":60,"rel_ai":85,"rel_os":60,"rel_mobile":60,"rel_news":60,"difficulty":"Low","audience":"AI/Marketing","est":"10-200","notes":"Large AI-focused marketing groups. Good for B2C AI tools."},{"id":80,"name":"Facebook - Startup Specialists","category":"Community","url":"facebook.com/groups","cost":"Free","traffic":65,"ease":65,"rel_saas":80,"rel_ai":72,"rel_os":68,"rel_mobile":70,"rel_news":65,"difficulty":"Low","audience":"Founders","est":"10-150","notes":"Medium engagement. Launch announcements welcomed."},{"id":81,"name":"Facebook - No Code Founders","category":"Community","url":"facebook.com/groups","cost":"Free","traffic":55,"ease":70,"rel_saas":78,"rel_ai":78,"rel_os":70,"rel_mobile":72,"rel_news":65,"difficulty":"Low","audience":"No-Code Builders","est":"10-150","notes":"Targeted audience. High intent."},{"id":82,"name":"Discord - Indie Hackers","category":"Community","url":"discord.gg","cost":"Free","traffic":70,"ease":70,"rel_saas":88,"rel_ai":83,"rel_os":78,"rel_mobile":70,"rel_news":73,"difficulty":"Low","audience":"Indie Founders","est":"10-300","notes":"Very active #show-your-product channel. Engaged community."},{"id":83,"name":"Discord - Buildspace","category":"Community","url":"buildspace.so","cost":"Free","traffic":65,"ease":65,"rel_saas":70,"rel_ai":80,"rel_os":80,"rel_mobile":75,"rel_news":60,"difficulty":"Low","audience":"Builders","est":"10-200","notes":"Builder community. Show what you're building."},{"id":84,"name":"Discord - AI Builders Hub","category":"Community","url":"discord.gg","cost":"Free","traffic":60,"ease":70,"rel_saas":60,"rel_ai":90,"rel_os":70,"rel_mobile":65,"rel_news":55,"difficulty":"Low","audience":"AI Builders","est":"10-300","notes":"Active AI builder community. Demo day channels common."},{"id":85,"name":"Discord - No Code Founders","category":"Community","url":"discord.gg","cost":"Free","traffic":55,"ease":75,"rel_saas":78,"rel_ai":78,"rel_os":70,"rel_mobile":72,"rel_news":65,"difficulty":"Low","audience":"No-Code Builders","est":"10-200","notes":"Supportive community. Good for feedback + early users."},{"id":86,"name":"Discord - SaaS Founders Hub","category":"Community","url":"discord.gg","cost":"Free","traffic":55,"ease":72,"rel_saas":87,"rel_ai":78,"rel_os":68,"rel_mobile":66,"rel_news":68,"difficulty":"Low","audience":"SaaS Founders","est":"10-200","notes":"Dedicated SaaS founder community."},{"id":87,"name":"Discord - Entrepreneurs","category":"Community","url":"discord.gg","cost":"Free","traffic":60,"ease":68,"rel_saas":78,"rel_ai":73,"rel_os":68,"rel_mobile":70,"rel_news":65,"difficulty":"Low","audience":"Entrepreneurs","est":"10-200","notes":"General entrepreneur servers. Variable quality."},{"id":88,"name":"Discord - Lovable Community","category":"Community","url":"discord.gg","cost":"Free","traffic":65,"ease":70,"rel_saas":80,"rel_ai":82,"rel_os":72,"rel_mobile":74,"rel_news":62,"difficulty":"Low","audience":"Builders","est":"10-300","notes":"Highly relevant for Lovable builders. Share your launch."},{"id":89,"name":"Discord - Cursor Community","category":"Community","url":"discord.gg","cost":"Free","traffic":60,"ease":72,"rel_saas":72,"rel_ai":78,"rel_os":80,"rel_mobile":70,"rel_news":58,"difficulty":"Low","audience":"Developers","est":"10-200","notes":"Cursor users. Good for AI-adjacent products."},{"id":90,"name":"Discord - Bolt Community","category":"Community","url":"discord.gg","cost":"Free","traffic":60,"ease":72,"rel_saas":78,"rel_ai":80,"rel_os":72,"rel_mobile":72,"rel_news":60,"difficulty":"Low","audience":"Builders","est":"10-200","notes":"Bolt builder community. Share what you made."},{"id":91,"name":"AppSumo","category":"Marketplace","url":"appsumo.com","cost":"Revenue Share","traffic":90,"ease":30,"rel_saas":80,"rel_ai":75,"rel_os":65,"rel_mobile":65,"rel_news":60,"difficulty":"Very High","audience":"SMB/Founders","est":"500-10000","notes":"50% revenue share. Massive exposure. Brutal reviews. Ideal for validated products."},{"id":92,"name":"Gumroad Discover","category":"Marketplace","url":"gumroad.com","cost":"Free+5%","traffic":70,"ease":60,"rel_saas":70,"rel_ai":70,"rel_os":75,"rel_mobile":70,"rel_news":75,"difficulty":"Low","audience":"Consumers/Indie","est":"10-500","notes":"Good for simpler tools + digital products. Easy to list."},{"id":93,"name":"Lemon Squeezy","category":"Marketplace","url":"lemonsqueezy.com","cost":"Free+5%","traffic":65,"ease":60,"rel_saas":75,"rel_ai":70,"rel_os":70,"rel_mobile":65,"rel_news":65,"difficulty":"Low","audience":"Developers/Founders","est":"5-200","notes":"Marketplace discovery secondary to payment processing. Still worth listing."},{"id":94,"name":"Elpha","category":"Community","url":"elpha.com","cost":"Free","traffic":55,"ease":65,"rel_saas":75,"rel_ai":72,"rel_os":65,"rel_mobile":68,"rel_news":68,"difficulty":"Low","audience":"Women in Tech","est":"10-200","notes":"Supportive community. Good for diverse founder stories."},{"id":95,"name":"Polywork","category":"Community","url":"polywork.com","cost":"Free","traffic":50,"ease":65,"rel_saas":72,"rel_ai":70,"rel_os":72,"rel_mobile":70,"rel_news":65,"difficulty":"Low","audience":"Builders","est":"5-100","notes":"Professional portfolio meets maker community."},{"id":96,"name":"Stack Overflow Collectives","category":"Community","url":"stackoverflow.com","cost":"Free","traffic":90,"ease":35,"rel_saas":55,"rel_ai":65,"rel_os":90,"rel_mobile":65,"rel_news":45,"difficulty":"High","audience":"Developers","est":"10-500","notes":"Technical Q&A. Can't promote directly. Provide value + link to tool."},{"id":97,"name":"DEV.to","category":"Community","url":"dev.to","cost":"Free","traffic":80,"ease":65,"rel_saas":65,"rel_ai":75,"rel_os":85,"rel_mobile":70,"rel_news":65,"difficulty":"Low","audience":"Developers","est":"20-500","notes":"Write about how you built it. Community appreciates build logs."},{"id":98,"name":"Medium/Substack Launch Post","category":"Content","url":"medium.com","cost":"Free","traffic":85,"ease":60,"rel_saas":70,"rel_ai":75,"rel_os":70,"rel_mobile":70,"rel_news":75,"difficulty":"Low","audience":"General","est":"20-500","notes":"Write your launch story. SEO long-tail value. Good for storytelling founders."},{"id":99,"name":"Hashnode","category":"Community","url":"hashnode.dev","cost":"Free","traffic":70,"ease":70,"rel_saas":65,"rel_ai":72,"rel_os":82,"rel_mobile":68,"rel_news":62,"difficulty":"Low","audience":"Developers","est":"10-300","notes":"Dev blogging platform. Built-in discovery. Write technical posts."},{"id":100,"name":"Startup Ranking","category":"Directory","url":"startupranking.com","cost":"Free","traffic":55,"ease":75,"rel_saas":75,"rel_ai":70,"rel_os":68,"rel_mobile":68,"rel_news":60,"difficulty":"Low","audience":"Founders","est":"5-100","notes":"Global startup rankings. Submit for discovery + SEO."}];

// ─── SCORING ENGINE ─────────────────────────────────────────────────
// Composite = (traffic × 0.5) + (ease × 0.3) + (relevance × 0.2)
// Relevance column is chosen by product type.
const REL_KEY = {
  saas: "rel_saas",
  ai_tool: "rel_ai",
  mobile: "rel_mobile",
  open_source: "rel_os",
  newsletter: "rel_news",
};

function scoreChannel(channel, productType) {
  const relKey = REL_KEY[productType] || "rel_saas";
  const relevance = channel[relKey];
  return Math.round(channel.traffic * 0.5 + channel.ease * 0.3 + relevance * 0.2);
}

// Budget filter: which costs are allowed
function costAllowed(cost, budget) {
  const c = cost.toLowerCase();
  const isFree = c === "free" || c.includes("free");
  const isPaid = c.includes("paid") || c.includes("revenue") || c.includes("%");
  if (budget === "free") return isFree && !c.includes("paid");
  if (budget === "low") return isFree || (isPaid && !c.includes("revenue"));
  return true; // medium / high budget → everything
}

function buildPlan({ productType, audience, budget, stage }) {
  let pool = CHANNELS.filter((ch) => costAllowed(ch.cost, budget));

  const scored = pool.map((ch) => {
    let score = scoreChannel(ch, productType);

    // Stage adjustments
    if (stage === "idea") {
      // Pre-launch: boost waitlist / early-access channels
      if (/waitlist|pre-launch|upcoming|early|beta/i.test(ch.notes) ||
          ch.name.includes("BetaList") || ch.name.includes("Upcoming")) {
        score += 8;
      }
    }
    if (stage === "live") {
      // Established: boost SEO / directory channels
      if (ch.category === "Directory") score += 4;
    }

    // Audience nudges
    if (audience === "developers" && /developer|dev/i.test(ch.audience)) score += 5;
    if (audience === "enterprise" && /business|buyer|enterprise/i.test(ch.audience)) score += 5;
    if (audience === "consumers" && /public|consumer/i.test(ch.audience)) score += 5;
    if (audience === "smb" && /smb|small business/i.test(ch.audience)) score += 5;

    return { ...ch, score: Math.min(score, 100) };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 20);
}

// ─── QUESTIONNAIRE CONFIG ───────────────────────────────────────────
const QUESTIONS = [
  {
    id: "productType",
    q: "What did you build?",
    options: [
      ["saas", "SaaS"],
      ["ai_tool", "AI Tool"],
      ["mobile", "Mobile App"],
      ["open_source", "Open Source"],
      ["newsletter", "Newsletter"],
    ],
  },
  {
    id: "audience",
    q: "Who is it for?",
    options: [
      ["developers", "Developers"],
      ["smb", "Small Business"],
      ["enterprise", "Enterprise"],
      ["consumers", "Consumers"],
    ],
  },
  {
    id: "budget",
    q: "What's your launch budget?",
    options: [
      ["free", "Free only"],
      ["low", "Up to €100"],
      ["medium", "Up to €500"],
      ["high", "No limit"],
    ],
  },
  {
    id: "stage",
    q: "What stage are you at?",
    options: [
      ["idea", "Pre-launch / waitlist"],
      ["launched", "Just launched"],
      ["live", "Live 3+ months"],
    ],
  },
];


// ════════════════════════════════════════════════════════════════════
//  UI
// ════════════════════════════════════════════════════════════════════

const COLORS = {
  bg: "#0B1120",
  panel: "#111A2E",
  card: "#16203A",
  border: "#243049",
  accent: "#3B82F6",
  accentSoft: "#1E3A5F",
  text: "#E8EDF7",
  muted: "#8B97AC",
  green: "#34D399",
  amber: "#FBBF24",
  red: "#F87171",
};

function diffColor(d) {
  if (/very high/i.test(d)) return COLORS.red;
  if (/high/i.test(d)) return COLORS.amber;
  if (/medium/i.test(d)) return "#60A5FA";
  return COLORS.green;
}

function ScoreBar({ score }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 8, background: COLORS.accentSoft, borderRadius: 99, overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.green})`, borderRadius: 99 }} />
      </div>
      <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 700, fontSize: 14, color: COLORS.text, minWidth: 28, textAlign: "right" }}>{score}</span>
    </div>
  );
}

function Badge({ children, color }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 99, background: `${color}22`, color, border: `1px solid ${color}44`, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function ChannelCard({ channel, rank, locked }) {
  return (
    <div style={{
      position: "relative",
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 14,
      padding: 18,
      filter: locked ? "blur(5px)" : "none",
      userSelect: locked ? "none" : "auto",
      pointerEvents: locked ? "none" : "auto",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, background: rank <= 3 ? COLORS.accent : COLORS.accentSoft,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 14, color: rank <= 3 ? "#fff" : COLORS.muted, flexShrink: 0,
          }}>{rank}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.text, lineHeight: 1.2 }}>{channel.name}</div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>{channel.category}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Badge color={channel.cost.toLowerCase().includes("free") ? COLORS.green : COLORS.amber}>{channel.cost}</Badge>
          <Badge color={diffColor(channel.difficulty)}>{channel.difficulty}</Badge>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <ScoreBar score={channel.score} />
      </div>

      <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.5, marginBottom: 12 }}>{channel.notes}</div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span style={{ fontSize: 12, color: COLORS.muted }}>
          <span style={{ color: COLORS.text, fontWeight: 600 }}>{channel.est}</span> users / launch
        </span>
        <a href={`https://${channel.url}`} target="_blank" rel="noreferrer"
          style={{ fontSize: 13, fontWeight: 600, color: COLORS.accent, textDecoration: "none", padding: "6px 12px", border: `1px solid ${COLORS.accent}55`, borderRadius: 8 }}>
          Go to channel →
        </a>
      </div>
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("landing"); // landing | quiz | results
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [productName, setProductName] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const plan = useMemo(() => {
    if (screen !== "results") return [];
    return buildPlan({
      productType: answers.productType,
      audience: answers.audience,
      budget: answers.budget,
      stage: answers.stage,
    });
  }, [screen, answers]);

  function pick(qid, value) {
    const next = { ...answers, [qid]: value };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setScreen("nameStep");
    }
  }

  function restart() {
    setScreen("landing");
    setStep(0);
    setAnswers({});
    setProductName("");
    setUnlocked(false);
  }

  const wrap = {
    minHeight: "100vh",
    background: COLORS.bg,
    color: COLORS.text,
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  };
  const container = { maxWidth: 760, margin: "0 auto", padding: "0 20px" };

  // ─── LANDING ──────────────────────────────────────────────────────
  if (screen === "landing") {
    return (
      <div style={wrap}>
        <header style={{ ...container, paddingTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 800, fontSize: 18 }}>
            <span style={{ width: 26, height: 26, borderRadius: 7, background: COLORS.accent, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>◎</span>
            LaunchItUp
          </div>
          <button onClick={() => setScreen("quiz")} style={{ background: "transparent", color: COLORS.muted, border: "none", fontSize: 14, cursor: "pointer", fontWeight: 600 }}>Get started →</button>
        </header>

        <section style={{ ...container, paddingTop: 90, paddingBottom: 40, textAlign: "center" }}>
          <div style={{ display: "inline-block", fontSize: 12, fontWeight: 600, color: COLORS.accent, background: COLORS.accentSoft, padding: "6px 14px", borderRadius: 99, marginBottom: 28 }}>
            100+ launch channels, scored for your product
          </div>
          <h1 style={{ fontSize: 52, lineHeight: 1.05, fontWeight: 800, margin: "0 0 20px", letterSpacing: "-0.02em" }}>
            Find your first<br /><span style={{ color: COLORS.accent }}>100 users</span> in 60 seconds.
          </h1>
          <p style={{ fontSize: 18, color: COLORS.muted, maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.5 }}>
            You built something. Now you don't know where to launch it. Answer 4 questions and get a ranked plan of exactly where to post.
          </p>
          <button onClick={() => setScreen("quiz")} style={{
            background: COLORS.accent, color: "#fff", border: "none", padding: "16px 32px",
            fontSize: 17, fontWeight: 700, borderRadius: 12, cursor: "pointer", boxShadow: `0 8px 24px ${COLORS.accent}44`,
          }}>Get my launch plan</button>
          <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 14 }}>Free. No account needed.</div>
        </section>

        <section style={{ ...container, paddingBottom: 60 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {[
              ["Built it, no users", "You shipped a product but have zero distribution instinct."],
              ["Generic advice", "ChatGPT says 'try social media.' That's a category, not a plan."],
              ["Wasted launches", "You post in the wrong places and get nothing back."],
            ].map(([t, d]) => (
              <div key={t} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 18 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{t}</div>
                <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.5 }}>{d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section style={{ ...container, paddingBottom: 90 }}>
          <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 800, marginBottom: 28 }}>Simple pricing</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {[
              ["Free", "€0", ["Top 5 channels", "Personalised scores", "No account needed"], false],
              ["Launch", "€9", ["Full top 20 channels", "Notes + direct links", "One-time payment"], true],
              ["Pro", "€29/mo", ["Everything in Launch", "Launch tracker", "Results analytics"], false],
            ].map(([name, price, feats, hot]) => (
              <div key={name} style={{
                background: hot ? COLORS.accentSoft : COLORS.card,
                border: `1px solid ${hot ? COLORS.accent : COLORS.border}`,
                borderRadius: 16, padding: 22, position: "relative",
              }}>
                {hot && <div style={{ position: "absolute", top: -10, left: 22, background: COLORS.accent, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>POPULAR</div>}
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{name}</div>
                <div style={{ fontSize: 30, fontWeight: 800, marginBottom: 16 }}>{price}</div>
                {feats.map((f) => (
                  <div key={f} style={{ fontSize: 13, color: COLORS.muted, marginBottom: 8, display: "flex", gap: 8 }}>
                    <span style={{ color: COLORS.green }}>✓</span>{f}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // ─── QUIZ ─────────────────────────────────────────────────────────
  if (screen === "quiz") {
    const question = QUESTIONS[step];
    const progress = ((step + 1) / (QUESTIONS.length + 1)) * 100;
    return (
      <div style={wrap}>
        <div style={{ ...container, paddingTop: 28 }}>
          <div style={{ height: 5, background: COLORS.card, borderRadius: 99, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ width: `${progress}%`, height: "100%", background: COLORS.accent, transition: "width .3s" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: COLORS.muted }}>
            <button onClick={() => (step === 0 ? setScreen("landing") : setStep(step - 1))} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 13 }}>← Back</button>
            <span>Step {step + 1} of {QUESTIONS.length + 1}</span>
          </div>
        </div>

        <div style={{ ...container, paddingTop: 70, maxWidth: 560 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32, letterSpacing: "-0.01em" }}>{question.q}</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {question.options.map(([val, label]) => {
              const active = answers[question.id] === val;
              return (
                <button key={val} onClick={() => pick(question.id, val)} style={{
                  textAlign: "left", padding: "18px 20px", borderRadius: 14, cursor: "pointer",
                  background: active ? COLORS.accentSoft : COLORS.card,
                  border: `1px solid ${active ? COLORS.accent : COLORS.border}`,
                  color: COLORS.text, fontSize: 16, fontWeight: 600, transition: "all .15s",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = COLORS.accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = active ? COLORS.accent : COLORS.border)}
                >{label}</button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─── NAME STEP ────────────────────────────────────────────────────
  if (screen === "nameStep") {
    return (
      <div style={wrap}>
        <div style={{ ...container, paddingTop: 28 }}>
          <div style={{ height: 5, background: COLORS.card, borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: "100%", height: "100%", background: COLORS.accent }} />
          </div>
        </div>
        <div style={{ ...container, paddingTop: 90, maxWidth: 520, textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 14 }}>What's your product called?</h2>
          <p style={{ color: COLORS.muted, marginBottom: 28 }}>Last one. Then your plan is ready.</p>
          <input
            autoFocus value={productName} onChange={(e) => setProductName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && productName.trim() && setScreen("results")}
            placeholder="e.g. CorePoker"
            style={{
              width: "100%", padding: "16px 18px", fontSize: 17, borderRadius: 12, marginBottom: 18,
              background: COLORS.card, border: `1px solid ${COLORS.border}`, color: COLORS.text, outline: "none", boxSizing: "border-box",
            }}
          />
          <button disabled={!productName.trim()} onClick={() => setScreen("results")} style={{
            width: "100%", background: productName.trim() ? COLORS.accent : COLORS.card,
            color: productName.trim() ? "#fff" : COLORS.muted, border: "none", padding: "16px",
            fontSize: 17, fontWeight: 700, borderRadius: 12, cursor: productName.trim() ? "pointer" : "not-allowed",
          }}>Show my launch plan →</button>
        </div>
      </div>
    );
  }

  // ─── RESULTS ──────────────────────────────────────────────────────
  const typeLabel = QUESTIONS[0].options.find((o) => o[0] === answers.productType)?.[1] || "product";
  return (
    <div style={wrap}>
      <header style={{ ...container, paddingTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 800, fontSize: 18 }}>
          <span style={{ width: 26, height: 26, borderRadius: 7, background: COLORS.accent, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>◎</span>
          LaunchItUp
        </div>
        <button onClick={restart} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Start over</button>
      </header>

      <div style={{ ...container, paddingTop: 40, paddingBottom: 14 }}>
        <div style={{ fontSize: 13, color: COLORS.accent, fontWeight: 600, marginBottom: 8 }}>YOUR LAUNCH PLAN</div>
        <h1 style={{ fontSize: 34, fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.01em" }}>
          {productName || "Your product"}
        </h1>
        <p style={{ color: COLORS.muted, fontSize: 15 }}>
          The 20 best places to launch your {typeLabel}, ranked for your audience and budget.
        </p>
      </div>

      <div style={{ ...container, paddingBottom: 80, display: "grid", gap: 12, marginTop: 18 }}>
        {plan.map((ch, i) => {
          const locked = !unlocked && i >= 5;
          return <ChannelCard key={ch.id} channel={ch} rank={i + 1} locked={locked} />;
        })}

        {/* Unlock overlay */}
        {!unlocked && plan.length > 5 && (
          <div style={{
            position: "relative", marginTop: -180, paddingTop: 120,
            background: `linear-gradient(180deg, transparent, ${COLORS.bg} 55%)`,
            display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
          }}>
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.accent}`, borderRadius: 18, padding: 28, maxWidth: 420, width: "100%" }}>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Unlock all 20 channels</div>
              <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 20, lineHeight: 1.5 }}>
                You're seeing the top 5. Get the full ranked plan with notes and direct links for every channel.
              </p>
              {/* 👉 PLUG-IN POINT: replace this onClick with your Stripe Checkout link.
                  e.g. window.location.href = "https://buy.stripe.com/your_link"
                  On payment success, Stripe redirects back and you call setUnlocked(true). */}
              <button onClick={() => setUnlocked(true)} style={{
                width: "100%", background: COLORS.accent, color: "#fff", border: "none",
                padding: "15px", fontSize: 16, fontWeight: 700, borderRadius: 12, cursor: "pointer",
              }}>Unlock full plan — €9</button>
              <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 12 }}>One-time payment · Demo: click to preview</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
