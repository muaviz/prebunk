"use client";

import { Claim } from "@/types";

export function ShareButtons({ claim }: { claim: Claim }) {
  const url = `https://prebunk.vercel.app/claims/${claim.id}`;
  
  // Format sources for the tweet
  const sourcesText = claim.refutations
    ?.slice(0, 2)
    .map(r => r.source_name)
    .join(", ");
    
  const encodedText = encodeURIComponent(
    `🚨 Viral Misinformation Alert: "${claim.title}"\n\n` +
    `Before you share or argue online, know the facts. This claim is false.\n\n` +
    `Source facts from: ${sourcesText || "Academic & Theological sources"}\n\n` +
    `Read the full pre-bunk here: `
  );
  
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodeURIComponent(url)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const whatsappUrl = `https://wa.me/?text=${encodedText}${encodeURIComponent(url)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodedText}`;
  const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent("Fake claim alert: " + claim.title)}`;

  return (
    <div className="flex flex-col gap-2.5 mt-4">
      <a 
        href={twitterUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Share this debunk on X (Twitter)"
        className="flex items-center justify-center gap-2 h-11 w-full rounded-md text-sm font-medium transition-colors text-white bg-black hover:bg-gray-800"
      >
        <svg className="shrink-0" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        X (Twitter)
        <span className="sr-only">(opens in new tab)</span>
      </a>
      <a 
        href={facebookUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Share this debunk on Facebook"
        className="flex items-center justify-center gap-2 h-11 w-full rounded-md text-sm font-medium transition-colors text-white bg-[#1877F2] hover:bg-[#166fe5]"
      >
        <svg className="shrink-0" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        Facebook
        <span className="sr-only">(opens in new tab)</span>
      </a>
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Share this debunk on WhatsApp"
        className="flex items-center justify-center gap-2 h-11 w-full rounded-md text-sm font-medium transition-colors text-white bg-[#25D366] hover:bg-[#22c35e]"
      >
        <svg className="shrink-0" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        WhatsApp
        <span className="sr-only">(opens in new tab)</span>
      </a>
      <a 
        href={telegramUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Share this debunk on Telegram"
        className="flex items-center justify-center gap-2 h-11 w-full rounded-md text-sm font-medium transition-colors text-white bg-[#0088cc] hover:bg-[#0077b5]"
      >
        <svg className="shrink-0" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zM5.872 11.645c3.772-1.643 6.287-2.727 7.545-3.253 3.585-1.5 4.331-1.758 4.817-1.767.106-.002.343.024.496.15.128.104.165.247.183.345.018.099.039.317.02.502-.218 2.193-1.163 7.842-1.647 10.457-.205 1.109-.607 1.478-1.002 1.515-.873.08-1.536-.576-2.385-1.134-1.328-.871-2.077-1.41-3.37-2.261-1.492-1.026-.525-1.59.324-2.473.222-.232 4.08-3.743 4.154-4.06.01-.08.017-.189-.047-.243-.064-.053-.162-.036-.231-.02-.099.023-1.677 1.066-4.73 3.125-.447.308-.85.46-1.21.452-.397-.009-1.162-.225-1.73-.41-.698-.226-1.252-.347-1.205-.733.024-.199.308-.403.85-.613z"/></svg>
        Telegram
        <span className="sr-only">(opens in new tab)</span>
      </a>
      <a 
        href={redditUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Share this debunk on Reddit"
        className="flex items-center justify-center gap-2 h-11 w-full rounded-md text-sm font-medium transition-colors text-white bg-[#FF4500] hover:bg-[#e03d00]"
      >
        <svg className="shrink-0" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.561-1.25-1.25-1.25zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
        Reddit
        <span className="sr-only">(opens in new tab)</span>
      </a>
    </div>
  );
}
