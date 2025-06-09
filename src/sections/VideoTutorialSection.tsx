import { FC } from 'react';

export const VideoTutorialSection: FC = () => {
  return (
    <section id="tutorial" className="py-16 bg-white">
      <div style={{position: "relative", boxSizing: "content-box", maxHeight: "80vh", width: "100%", aspectRatio: "2.073186528497409", padding: "40px 0 40px 0"}}>
        <iframe 
          src="https://app.supademo.com/embed/cmbpj9aosawotsn1rzrvabgfp?embed_v=2" 
          loading="lazy" 
          title="How to use ACENSTRA" 
          allow="clipboard-write" 
          frameBorder="0" 
          allowFullScreen 
          style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%"}}
        ></iframe>
      </div>
    </section>
  );
}
