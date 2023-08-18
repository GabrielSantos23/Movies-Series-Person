import React, { useEffect } from 'react';

interface WarezIframeProps {
  type: 'filme' | 'serie';
  imdb: string;
  season?: string;
  episode?: string;
}

const WarezIframe: React.FC<WarezIframeProps> = ({
  type,
  imdb,
  season = '',
  episode = '',
}) => {
  useEffect(() => {
    let iframeSrc = `https://embed.warezcdn.com/${type}/${imdb}`;

    if (type === 'serie' && season !== '') {
      season = `/${season}`;
    }

    if (type === 'serie' && episode !== '') {
      episode = `/${episode}`;
    }

    iframeSrc += `${season}${episode}`;

    const frame = document.getElementById('embedWarezCdn');
    if (frame) {
      frame.innerHTML = `<iframe src="${iframeSrc}" class="h-[900px]  w-full xl:h-[700px]" scrolling="no" frameborder="0" allowfullscreen="" webkitallowfullscreen="" mozallowfullscreen=""></iframe>`;
    }
  }, [type, imdb, season, episode]);

  return <div id='embedWarezCdn' className=''></div>;
};

export default WarezIframe;
