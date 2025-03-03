import React from 'react';
import '@/ui/fontawesome/css/fa.css';
import { getArticleCount } from '@/lib/api/article';
import { getGalleryPhotosCount } from '@/lib/api/photos';

export default async () => {
  const [articlesCount, photosCount] = await Promise.all([
    getArticleCount(),
    getGalleryPhotosCount()
  ]);

  return (
    <div className='flex min-h-[calc(100dvh-4rem)] flex-col px-8 pt-[5rem]'>
      <h2 className={'main-title py-4'}>Despre noi</h2>
      <section>
        <div className={'flex mobile:flex-col'}>
          <div className={'w-3/4 laptop:w-2/3 tablet:w-1/2 mobile:w-full'}>
            <h2 className={'small-title py-4'}>Mândră de elevii mei!</h2>
            <p className={'py-2'}>
              Literatura este un domeniu ce necesită interpretare și
              reinterpretare cu fiecare generație.
            </p>
            <p className={'py-2'}>
              Descoperind literatura română veche, apoi pe cea pașoptistă și
              interbelică, elevii clasei a XI-a D (2022-2023 - Manea Vlad,
              Gavrilă Vlăduț, Mihăilă Eduard, Bene Ionuț) de la Colegiul
              Național de Informatică „Gr. Moisil” din Brașov au considerat că
              vocea lor poate fi auzită prin crearea unui site care să-i ajute
              atât pe ei, cât și pe colegii lor în însușirea unor informații
              despre autori, opere, cinematografie.
            </p>
            <p className={'py-2'}>
              Treptat, ideea a prins contur și repetabilele „comentarii pe text”
              s-au transformat în articole stângace, dar cu amprenta personală a
              fiecărui creator de text.
            </p>
            <p className={'py-2'}>
              În acest an școlar (2023-2024), ștafeta a fost înmânată clasei a
              X-a D (Cazacu Matei, Simedrea Alexandru). Schimbarea designului,
              rapiditatea de mișcare a site-ului, ușurința accesării articolelor
              sunt doar câteva dintre metodele de eficientizare a acestui spațiu
              virtual.
            </p>
            <p className={'py-2'}>
              În forma sa actuală, site-ul oferă oportunitatea exprimării libere
              a liceenilor pasionați de literatură în articolele cărora
              subiectivitatea și obiectivitatea se află în proporții egale.
            </p>
            <p className={'py-2'}>
              Sunt convinsă că numărul articolelor și calitatea lor vor crește
              constant și că munca elevilor va fi apreciată de cei care ne
              vizitează site-ul.
            </p>
            <p className={'py-2'}>Prof. Raluca Iancău</p>
          </div>
          <div
            className={
              'w-1/4 px-20 laptop:w-1/3 tablet:w-1/2 mobile:w-full mobile:max-w-[200px] mobile:px-0'
            }
          >
            <img
              src={'/images/raluca_iancau.jpg'}
              alt='Raluca Iancau'
              className={'w-full rounded-3xl'}
            />
          </div>
        </div>
      </section>
      <section className={'pt-20'}>
        <h2 className={'small-title py-4'}>Echipa noastră</h2>
        <div
          className={
            'flex items-center justify-around pt-8 mobile:flex-col mobile:gap-12'
          }
        >
          <div className={'flex flex-col items-center justify-center'}>
            <i
              className={'fa fa-solid fa-chalkboard-teacher pb-3 text-6xl'}
            ></i>
            <p className={'py-1 font-semibold'}>Profesor coordonator</p>
            <p>Iancău Raluca</p>
          </div>
          <div className={'h-[80px] w-0.5 bg-black mobile:hidden'}></div>
          <div className={'flex flex-col items-center justify-center'}>
            <i className={'fa fa-solid fa-code pb-3 text-6xl'}></i>
            <p className={'py-1 font-semibold'}>Dezvoltarea site-ului</p>
            <p>Cazacu Matei</p>
            <p>Simedrea Alexandru</p>
          </div>
          <div className={'h-[80px] w-0.5 bg-black mobile:hidden'}></div>
          <div className={'flex flex-col items-center justify-center'}>
            <i className={'fa fa-solid fa-pen-paintbrush pb-3 text-6xl'}></i>
            <p className={'py-1 font-semibold'}>Design</p>
            <p>Simedrea Alexandru</p>
          </div>
        </div>
      </section>
      <section className={'pt-20'}>
        <h2 className={'small-title py-4'}>Statistici</h2>
        <div
          className={
            'flex items-center justify-around pt-8 mobile:flex-col mobile:gap-12'
          }
        >
          <div className={'flex flex-col items-center justify-center'}>
            <p className={'py-1 text-4xl font-semibold'}>
              {articlesCount.articles}
            </p>
            <p>articole</p>
          </div>
          <div className={'h-[80px] w-0.5 bg-black mobile:hidden'}></div>
          <div className={'flex flex-col items-center justify-center'}>
            <p className={'py-1 text-4xl font-semibold'}>
              {articlesCount.authors}
            </p>
            <p>autori articole</p>
          </div>
          <div className={'h-[80px] w-0.5 bg-black mobile:hidden'}></div>
          <div className={'flex flex-col items-center justify-center'}>
            <p className={'py-1 text-4xl font-semibold'}>{photosCount || 0}</p>
            <p>desene si picturi</p>
          </div>
          <div className={'h-[80px] w-0.5 bg-black mobile:hidden'}></div>
          <div className={'flex flex-col items-center justify-center'}>
            <p className={'py-1 text-4xl font-semibold'}>
              {articlesCount.reviews as number}
            </p>
            <p>recenzii de film</p>
          </div>
        </div>
      </section>
      <section className={'pt-20'}>
        <h2 className={'small-title py-4'}>Realizarea site-ului original</h2>
        <p className={'w-1/3 mobile:w-full'}>
          Manea Vlad, Gavrilă Vlăduț, Bighiu Matei, Mihăilă Eduard, Bene Ionuț,
          Nica Octavian, Macri Tudor, Russu Mihaela, Spiridon Roxana, Stoian
          Tudor, Butu Radu, Pintea Ștefan, Tomele Denis
        </p>
      </section>
      <section className={'pt-20'}>
        <h2 className={'small-title py-4'}>ISSN</h2>
        <p>Literaria (Brașov)</p>
        <p>ISSN 3044 - 800X</p>
        <p>ISSN-L 3044 - 800X</p>
      </section>
      <section className={'py-20'}>
        <h2 className={'small-title py-4'}>Contact</h2>
        <div className={'flex items-center gap-2 pb-1.5'}>
          <i className={'fa fa-solid fa-location-dot'}></i>
          <p>Calea București 75, Brașov 500326</p>
        </div>
        <div className={'flex items-center gap-2'}>
          <i className={'fa fa-solid fa-envelope'}></i>
          <p>literariamoisil@gmail.com</p>
        </div>
      </section>
    </div>
  );
};
