export default function VideoPlayer({ embeded }: { embeded: string }) {
  function getIframeSrc(htmlString: string): string | null {
    if (!htmlString) return "";
    const template = document.createElement("template");
    template.innerHTML = htmlString.trim();
    const iframe = template.content.querySelector("iframe");

    return iframe ? iframe.getAttribute("src") : null;
  }

  return (
    <div className="relative rounded-lg overflow-hidden bg-black video-Container">
      <iframe
        src={getIframeSrc(embeded) as any}
        className="w-full h-full"
        allow="autoplay; fullscreen"
        title="AI - Is it Software or Hardware"
      ></iframe>
    </div>
  );
}
