import { useEffect, useMemo, useState } from 'react';
import { Heart, ArrowUpRight, Search, MapPin, SlidersHorizontal, ChevronDown, Menu, X, CarFront, Compass, ShieldCheck, CalendarDays, Users, BedDouble, Bath, MoveRight, Check, CircleCheck, LocateFixed } from 'lucide-react';

type Mode = 'Rent' | 'Buy' | 'Ride';
type Listing = { id:number; name:string; place:string; price:string; detail:string; image:string; tag:string; rating:string; kind:'property'|'ride'; beds?:number; baths?:number; area?:string; rideType?:string; };
const homes: Listing[] = [
  {id:1,name:'Casa do Pátio',place:'Comporta, Portugal',price:'€1,850',detail:'/ month',image:'/coastal-home.jpg',tag:'Long-term rental',rating:'4.98',kind:'property',beds:3,baths:2,area:'178 m²'},
  {id:2,name:'The Alfama House',place:'Lisbon, Portugal',price:'€465,000',detail:'for sale',image:'/city-flat.jpg',tag:'Rare find',rating:'4.92',kind:'property',beds:2,baths:2,area:'124 m²'},
  {id:3,name:'Lodge in the Larches',place:'South Tyrol, Italy',price:'€2,450',detail:'/ month',image:'/mountain-cabin.jpg',tag:'Long-term rental',rating:'4.96',kind:'property',beds:4,baths:3,area:'210 m²'},
  {id:4,name:'Olive Grove Villa',place:'Alentejo, Portugal',price:'€720,000',detail:'for sale',image:'/coastal-home.jpg',tag:'New listing',rating:'4.89',kind:'property',beds:4,baths:3,area:'246 m²'},
  {id:5,name:'A little house by the sea',place:'Ericeira, Portugal',price:'€1,350',detail:'/ month',image:'/coastal-home.jpg',tag:'Long-term rental',rating:'4.91',kind:'property',beds:2,baths:1,area:'98 m²'},
  {id:6,name:'Rua das Flores Loft',place:'Porto, Portugal',price:'€395,000',detail:'for sale',image:'/city-flat.jpg',tag:'Thoughtful design',rating:'4.87',kind:'property',beds:2,baths:2,area:'116 m²'},
];
const rides: Listing[] = [
  {id:7,name:'The Coast Road, Slowly',place:'Lisbon → Comporta',price:'€185',detail:'from / journey',image:'/hero-wayfare.jpg',tag:'Half-day escape',rating:'5.0',kind:'ride',rideType:'Private chauffeured day trip'},
  {id:8,name:'A valley at your own pace',place:'Bolzano → Val Gardena',price:'€240',detail:'from / journey',image:'/mountain-cabin.jpg',tag:'Alpine route',rating:'4.98',kind:'ride',rideType:'Full-day private tour'},
  {id:9,name:'Lisbon, before the world wakes',place:'Lisbon, Portugal',price:'€72',detail:'from / transfer',image:'/city-flat.jpg',tag:'Airport transfer',rating:'4.97',kind:'ride',rideType:'Private airport pickup'},
  {id:10,name:'Between villages & vineyards',place:'Douro Valley, Portugal',price:'€210',detail:'from / journey',image:'/coastal-home.jpg',tag:'Local favourite',rating:'4.96',kind:'ride',rideType:'Scenic private day trip'},
];

function App() {
  const [mode,setMode] = useState<Mode>('Rent');
  const [query,setQuery] = useState('');
  const [appliedQuery,setAppliedQuery] = useState('');
  const [favorites,setFavorites] = useState<number[]>([]);
  const [savedOnly,setSavedOnly] = useState(false);
  const [filtersOpen,setFiltersOpen] = useState(false);
  const [typeFilter,setTypeFilter] = useState('Any home');
  const [bedroomFilter,setBedroomFilter] = useState('Any bedrooms');
  const [maxPrice,setMaxPrice] = useState('');
  const [modal,setModal] = useState<Listing|null>(null);
  const [mobileMenu,setMobileMenu] = useState(false);
  const [submitted,setSubmitted] = useState(false);
  useEffect(()=>{document.title='Shree Krishna Real Estate and Car Rentals'; const description=document.querySelector('meta[name="description"]')??document.createElement('meta');description.setAttribute('name','description');description.setAttribute('content','Find homes to rent or buy and book chauffeur-driven cars for tours and travel with Shree Krishna Real Estate and Car Rentals.');if(!description.parentNode)document.head.appendChild(description);},[]);
  const isRide=mode==='Ride';
  const data = isRide ? rides : homes.filter(h => mode==='Rent' ? h.detail==='/ month' : h.detail==='for sale');
  const filtered=useMemo(()=>data.filter(item=>{
    const q=appliedQuery.trim().toLowerCase();
    const matchQ=!q || `${item.name} ${item.place} ${item.tag}`.toLowerCase().includes(q);
    const matchSaved=!savedOnly || favorites.includes(item.id);
    const priceNum=Number(item.price.replace(/[^\d]/g,''));
    const matchPrice=!maxPrice || priceNum<=Number(maxPrice);
    const matchType=typeFilter==='Any home' || (typeFilter==='Apartments' ? !!item.beds&&item.beds<=2 : typeFilter==='Houses' ? !!item.beds&&item.beds>=3 : true);
    const bedroomCount=Number(bedroomFilter.match(/\d+/)?.[0]||0);
    const matchBedrooms=!bedroomCount || (bedroomFilter.includes('+') ? (item.beds||0)>=bedroomCount : item.beds===bedroomCount);
    return matchQ&&matchSaved&&matchPrice&&matchType&&matchBedrooms;
  }),[data,appliedQuery,savedOnly,favorites,maxPrice,typeFilter,bedroomFilter]);
  const toggleFavorite=(id:number)=>setFavorites(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);
  const search=()=>{setAppliedQuery(query);document.getElementById('discover')?.scrollIntoView({behavior:'smooth'});};
  const openInquiry=(item:Listing)=>{setModal(item);setSubmitted(false);};
  const closeModal=()=>{setModal(null);setSubmitted(false);};
  return <main className="min-h-[100dvh] bg-[#f5f2eb] text-[#263b34]">
    <div className="mx-auto max-w-[1440px] px-5 md:px-10">
      <header className="flex items-center justify-between py-5 md:py-6">
        <a href="/" className="flex items-center gap-3 no-underline text-[#263b34]" aria-label="Shree Krishna Real Estate and Car Rentals home">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#28483d] text-[#f8f4e9]"><Compass size={21}/></span>
          <span className="leading-none"><span className="serif block text-[19px] font-semibold tracking-[-.04em]">Shree Krishna</span><span className="mt-1.5 block text-[8px] font-semibold uppercase tracking-[.13em] text-[#7c8378]">Real Estate and Car Rentals</span></span>
        </a>
        <nav className="hidden items-center gap-8 text-[13px] font-medium text-[#59665e] md:flex">
          <a href="#discover" onClick={()=>setMode('Ride')} className="hover:text-[#28483d]">Chauffeur journeys</a><a href="#discover" onClick={()=>setMode('Rent')} className="hover:text-[#28483d]">Rent a home</a><a href="#how-it-works" className="hover:text-[#28483d]">How it works</a>
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={()=>{setSavedOnly(!savedOnly);document.getElementById('discover')?.scrollIntoView({behavior:'smooth'});}} className="hidden rounded-full border border-[#d9d7cc] px-4 py-2.5 text-[12px] font-semibold hover:bg-white md:inline-flex">Saved homes & trips{favorites.length>0&&<span className="ml-2 rounded-full bg-[#28483d] px-1.5 py-0.5 text-[10px] text-white">{favorites.length}</span>}</button>
          <button className="grid h-10 w-10 place-items-center rounded-full border border-[#d9d7cc] md:hidden" onClick={()=>setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu?<X size={18}/>:<Menu size={18}/>}</button>
          <button onClick={()=>document.getElementById('discover')?.scrollIntoView({behavior:'smooth'})} className="hidden rounded-full bg-[#28483d] px-5 py-3 text-[12px] font-semibold text-[#f7f4ea] transition hover:bg-[#1e392f] sm:block">Plan a trip <ArrowUpRight size={14} className="ml-1 inline"/></button>
        </div>
      </header>
      {mobileMenu&&<div className="mb-3 grid gap-3 rounded-2xl border border-[#e2ded3] bg-[#fbf9f4] p-4 md:hidden"><a href="#discover" onClick={()=>{setMode('Ride');setMobileMenu(false)}}>Chauffeur journeys</a><a href="#discover" onClick={()=>{setMode('Rent');setMobileMenu(false)}}>Rent a home</a><a href="#discover" onClick={()=>{setMode('Buy');setMobileMenu(false)}}>Buy a home</a><a href="#how-it-works" onClick={()=>setMobileMenu(false)}>How it works</a><button className="text-left" onClick={()=>{setSavedOnly(!savedOnly);setMobileMenu(false)}}>Saved homes & trips ({favorites.length})</button></div>}
      <section className="relative grid min-h-[550px] overflow-hidden rounded-[28px] bg-[#263c34] md:min-h-[594px] md:grid-cols-[.96fr_1.04fr]">
        <div className="relative z-10 flex flex-col justify-center px-7 py-12 md:px-14 lg:px-[76px]">
          <div className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.22em] text-[#d5b18d]"><span className="h-px w-7 bg-[#d5b18d]"/>One good place to begin</div>
          <h1 className="serif max-w-[510px] text-[50px] leading-[1.08] tracking-[-.04em] text-[#f5f1e8] md:text-[64px] lg:text-[72px]">A softer way<br/>to <em className="font-medium text-[#d8aa83]">get there.</em></h1>
          <p className="mt-6 max-w-[390px] text-[14px] leading-7 text-[#d0d5cc] md:text-[15px]">A trusted driver for the winding road. A place to settle in when you arrive. The details, thoughtfully taken care of.</p>
          <div className="mt-9 flex flex-wrap items-center gap-4 text-[11px] text-[#d1d6cc]"><span className="flex items-center gap-2"><ShieldCheck size={15} className="text-[#d4ae87]"/>Thoughtful local hosts</span><span className="h-1 w-1 rounded-full bg-[#b9a78b]"/><span>Independent journeys</span></div>
        </div>
        <div className="grain relative min-h-[300px] md:min-h-full">
          <img src="/hero-wayfare.jpg" alt="A quiet coastal road and touring car above the Atlantic" className="absolute inset-0 h-full w-full object-cover object-center"/>
          <div className="absolute inset-0 bg-gradient-to-t from-[#172a24]/50 via-transparent to-[#172a24]/5 md:bg-gradient-to-r md:from-[#263c34]/55 md:via-transparent md:to-transparent"/>
          <div className="absolute bottom-6 right-6 rounded-2xl border border-white/30 bg-[#f5f2eb]/90 px-4 py-3 shadow-lg backdrop-blur-sm md:bottom-9 md:right-9"><div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.14em] text-[#617168]"><MapPin size={12}/>Comporta, Portugal</div><div className="serif mt-1 text-[17px] text-[#263b34]">Take the long way.</div></div>
        </div>
      </section>

      <section className="relative z-20 mx-auto -mt-7 max-w-[1070px] rounded-[22px] border border-[#e7e3d8] bg-[#fbfaf6] p-3 shadow-[0_18px_48px_rgba(29,48,39,.12)] md:-mt-8 md:p-4">
        <div className="flex gap-1 rounded-full bg-[#eeece4] p-1.5 md:absolute md:-top-[51px] md:left-7 md:bg-[#fbfaf6] md:p-1.5">
          {(['Rent','Buy','Ride'] as Mode[]).map(m=><button key={m} onClick={()=>{setMode(m);setSavedOnly(false);setTypeFilter('Any home');setBedroomFilter('Any bedrooms');setMaxPrice('');}} className={`rounded-full px-5 py-2.5 text-[12px] font-semibold transition ${mode===m?'bg-[#28483d] text-white shadow-sm':'text-[#6c776e] hover:text-[#28483d]'}`}>{m==='Ride'?'Chauffeur':m}</button>)}
        </div>
        <div className="grid gap-2 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center">
          <label className="flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[#f3f1ea]"><MapPin className="shrink-0 text-[#b87458]" size={18}/><span className="min-w-0 flex-1"><span className="block text-[10px] font-bold uppercase tracking-[.12em] text-[#536259]">{isRide?'Where from?':'Where to?'}</span><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&search()} placeholder={isRide?'City, region or route':'City, region or neighbourhood'} className="mt-1 w-full border-0 bg-transparent p-0 text-[13px] text-[#263b34] outline-none placeholder:text-[#999d92]"/></span></label>
          <label className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[#f3f1ea]"><CalendarDays className="shrink-0 text-[#b87458]" size={18}/><span className="block"><span className="block text-[10px] font-bold uppercase tracking-[.12em] text-[#536259]">{isRide?'Travel date':mode==='Buy'?'Purchase timeline':'Move-in timing'}</span><input aria-label={isRide?'Travel date':mode==='Buy'?'Purchase timeline':'Move-in timing'} type="text" placeholder={isRide?'Add a date':mode==='Buy'?'Any time':'When are you looking?'} onFocus={e=>e.currentTarget.type='date'} className="mt-1 w-full min-w-[90px] border-0 bg-transparent p-0 text-[13px] text-[#263b34] outline-none placeholder:text-[#999d92]"/></span></label>
          <label className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[#f3f1ea]">{isRide?<Users className="shrink-0 text-[#b87458]" size={18}/>:<BedDouble className="shrink-0 text-[#b87458]" size={18}/>}<span className="block"><span className="block text-[10px] font-bold uppercase tracking-[.12em] text-[#536259]">{isRide?'Party size':'Bedrooms'}</span><select aria-label={isRide?'Party size':'Bedrooms'} value={isRide?'2 people':bedroomFilter} onChange={e=>{if(!isRide)setBedroomFilter(e.target.value)}} className="mt-1 w-full min-w-[88px] border-0 bg-transparent p-0 text-[13px] text-[#263b34] outline-none">{isRide?<><option>2 people</option><option>1 person</option><option>3 people</option><option>4+ people</option></>:<><option>Any bedrooms</option><option>1 bedroom</option><option>2 bedrooms</option><option>3 bedrooms</option><option>4+ bedrooms</option></>}</select></span><ChevronDown size={13} className="text-[#879087]"/></label>
          <button onClick={search} className="flex h-[52px] items-center justify-center gap-2 rounded-xl bg-[#c8795d] px-6 text-[13px] font-semibold text-white transition hover:bg-[#b66c52]"><Search size={17}/>Explore</button>
        </div>
      </section>

      <section id="discover" className="scroll-mt-7 pb-20 pt-20 md:pt-[88px]">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div><div className="mb-3 text-[10px] font-bold uppercase tracking-[.19em] text-[#b87458]">{isRide?'The road, in good hands':mode==='Buy'?'A place to put down roots':'Long-term rentals, chosen with care'}</div><h2 className="serif text-[36px] leading-tight tracking-[-.035em] md:text-[44px]">{isRide?'Journeys with room to wander':mode==='Buy'?'Homes with a little more meaning':'Find a home for the next chapter'}</h2><p className="mt-2 text-[13px] text-[#737d73]">{appliedQuery?`Showing thoughtful finds near “${appliedQuery}”`:'Considered homes and local journeys, ready when you are.'}</p></div>
          <div className="flex items-center gap-2">
            <button onClick={()=>{setSavedOnly(!savedOnly)}} className={`flex h-10 items-center gap-2 rounded-full border px-4 text-[12px] font-semibold transition ${savedOnly?'border-[#28483d] bg-[#28483d] text-white':'border-[#d9d7cc] bg-[#fbfaf6] hover:bg-white'}`}><Heart size={15} fill={savedOnly?'currentColor':'none'}/>Saved {favorites.length>0&&`(${favorites.length})`}</button>
            <button onClick={()=>setFiltersOpen(!filtersOpen)} className={`flex h-10 items-center gap-2 rounded-full border px-4 text-[12px] font-semibold transition ${filtersOpen?'border-[#28483d] bg-[#28483d] text-white':'border-[#d9d7cc] bg-[#fbfaf6] hover:bg-white'}`}><SlidersHorizontal size={15}/>Filters</button>
          </div>
        </div>
        {filtersOpen&&<div className="mb-6 flex flex-wrap items-end gap-4 rounded-2xl border border-[#e1ddd1] bg-[#fbfaf6] p-4 reveal">
          {!isRide&&<><label className="grid gap-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#66736a]">Home style<select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} className="min-w-[150px] rounded-lg border border-[#dedbd0] bg-[#f8f6ef] px-3 py-2.5 text-[13px] font-medium normal-case tracking-normal text-[#263b34]"><option>Any home</option><option>Houses</option><option>Apartments</option></select></label><label className="grid gap-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#66736a]">Bedrooms<select value={bedroomFilter} onChange={e=>setBedroomFilter(e.target.value)} className="min-w-[140px] rounded-lg border border-[#dedbd0] bg-[#f8f6ef] px-3 py-2.5 text-[13px] font-medium normal-case tracking-normal text-[#263b34]"><option>Any bedrooms</option><option>1 bedroom</option><option>2 bedrooms</option><option>3 bedrooms</option><option>4+ bedrooms</option></select></label></>}
          <label className="grid gap-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#66736a]">Maximum {isRide?'journey price':mode==='Buy'?'asking price':'monthly rent'}<span className="flex items-center gap-2 rounded-lg border border-[#dedbd0] bg-[#f8f6ef] px-3"><span className="text-sm text-[#838d84]">€</span><input type="number" min="0" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} placeholder="No limit" className="w-28 bg-transparent py-2.5 text-[13px] font-medium normal-case tracking-normal outline-none"/></span></label>
          <button onClick={()=>{setTypeFilter('Any home');setBedroomFilter('Any bedrooms');setMaxPrice('');setSavedOnly(false)}} className="mb-0.5 text-[12px] font-semibold text-[#a36047] underline underline-offset-4">Clear filters</button>
        </div>}
        {filtered.length>0?<div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item,i)=><article key={item.id} className="group min-w-0 reveal" style={{animationDelay:`${i*60}ms`}}>
            <div className="relative aspect-[1.33] overflow-hidden rounded-[19px] bg-[#e4dfd1]">
            <button onClick={()=>openInquiry(item)} className="block h-full w-full text-left">
              <img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"/>
              <span className="absolute left-3.5 top-3.5 rounded-full bg-[#f8f5ed]/95 px-3 py-1.5 text-[10px] font-semibold text-[#40584a]">{item.tag}</span>
              <span className="absolute bottom-3.5 right-3.5 flex items-center gap-1.5 rounded-full bg-[#f8f5ed]/95 px-3 py-1.5 text-[11px] font-bold text-[#283c33]">★ <span>{item.rating}</span></span>
            </button>
            <button onClick={()=>toggleFavorite(item.id)} aria-label={favorites.includes(item.id)?'Remove from saved':'Save listing'} className="absolute right-3.5 top-3.5 grid h-9 w-9 place-items-center rounded-full bg-[#fbfaf6]/95 text-[#344b3e] shadow-sm transition hover:scale-105"><Heart size={17} fill={favorites.includes(item.id)?'#bf7055':'none'} color={favorites.includes(item.id)?'#bf7055':'currentColor'}/></button>
            </div>
            <button onClick={()=>openInquiry(item)} className="mt-3 block w-full text-left">
              <div className="flex items-start justify-between gap-2"><div className="min-w-0"><h3 className="truncate text-[14px] font-semibold text-[#2b3e35]">{item.name}</h3><p className="mt-1 truncate text-[12px] text-[#727c72]">{item.kind==='ride'?item.rideType:item.place}</p></div><div className="shrink-0 text-right text-[13px] font-semibold">{item.price}<span className="font-normal text-[#737d73]"> {item.detail}</span></div></div>
              {item.kind==='property'&&<div className="mt-3 flex items-center gap-3 border-t border-[#e6e2d8] pt-2.5 text-[11px] text-[#68756c]"><span className="flex items-center gap-1"><BedDouble size={13}/>{item.beds} bedrooms</span><span className="flex items-center gap-1"><Bath size={13}/>{item.baths} baths</span><span>{item.area}</span><span className="ml-auto flex items-center gap-1 text-[#385c4b]">View home <ArrowUpRight size={12}/></span></div>}
              {item.kind==='ride'&&<div className="mt-3 flex items-center gap-2 border-t border-[#e6e2d8] pt-2.5 text-[11px] text-[#68756c]"><CarFront size={14}/><span>Private chauffeur</span><span className="ml-auto flex items-center gap-1 text-[#385c4b]">Plan this journey <ArrowUpRight size={12}/></span></div>}
            </button>
          </article>)}
        </div>:<div className="rounded-[24px] border border-[#e1ddd1] bg-[#fbfaf6] px-6 py-16 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#e9ede5] text-[#3e5e4b]"><LocateFixed size={22}/></span><h3 className="serif mt-4 text-2xl">A little off the map?</h3><p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-[#738076]">No matches just yet. Try another place or clear a filter and we’ll keep looking.</p><button onClick={()=>{setAppliedQuery('');setQuery('');setMaxPrice('');setTypeFilter('Any home');setSavedOnly(false)}} className="mt-5 rounded-full bg-[#28483d] px-5 py-2.5 text-[12px] font-semibold text-white">Show every listing</button></div>}
        <div className="mt-12 flex items-center justify-center"><button onClick={()=>{setAppliedQuery('');setQuery('');setSavedOnly(false)}} className="flex items-center gap-2 rounded-full border border-[#d9d7cc] px-5 py-3 text-[12px] font-semibold hover:bg-[#fbfaf6]">See all {isRide?'journeys':'places'} <MoveRight size={15}/></button></div>
      </section>

      <section id="how-it-works" className="mb-16 grid overflow-hidden rounded-[26px] bg-[#e9e7db] md:grid-cols-[1.15fr_.85fr]">
        <div className="px-7 py-9 md:px-12 md:py-12"><div className="mb-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#a96349]">One good thing leads to another</div><h2 className="serif max-w-lg text-[34px] leading-[1.13] tracking-[-.03em] md:text-[41px]">The journey is part of feeling at home.</h2><p className="mt-4 max-w-lg text-[13px] leading-7 text-[#69756d]">Meet a local driver who knows the scenic way. Find a home that feels like it has always been there. Make the in-between feel like part of the trip.</p><button onClick={()=>{setMode('Ride');document.getElementById('discover')?.scrollIntoView({behavior:'smooth'})}} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#28483d] px-5 py-3 text-[12px] font-semibold text-white">Explore a journey <ArrowUpRight size={14}/></button></div>
        <div className="relative min-h-[240px] overflow-hidden md:min-h-[320px]"><img src="/hero-wayfare.jpg" alt="Quiet road through the Portuguese coast" className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-r from-[#e9e7db]/30 to-transparent"/><div className="absolute bottom-5 right-5 rounded-2xl bg-[#f7f4eb]/90 px-4 py-3"><div className="text-[9px] font-bold uppercase tracking-[.16em] text-[#798178]">Local note</div><div className="serif mt-1 text-[15px]">The best part is often the detour.</div></div></div>
      </section>
      <footer className="flex flex-col gap-3 border-t border-[#dedbd0] py-7 text-[11px] text-[#788078] sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2"><Compass size={15} className="text-[#42604e]"/>© 2026 Shree Krishna Real Estate and Car Rentals</div><span>Independent journeys. Thoughtful places. A little more considered.</span><span className="rounded-full bg-[#e9e7db] px-3 py-1.5 text-[10px] font-semibold text-[#647268]">DEMO · Enquiries are not sent to a real business</span></footer>
    </div>
    {modal&&<div className="fixed inset-0 z-50 flex items-end justify-center bg-[#162720]/55 p-0 backdrop-blur-[2px] sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="inquiry-title" onMouseDown={e=>{if(e.target===e.currentTarget)closeModal()}}>
      <div className="relative max-h-[94dvh] w-full max-w-[510px] overflow-auto rounded-t-[24px] bg-[#fbfaf6] shadow-2xl sm:rounded-[24px]">
        <button onClick={closeModal} aria-label="Close inquiry" className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-[#f8f5ed] text-[#42574b]"><X size={18}/></button>
        {!submitted?<><img src={modal.image} alt="" className="h-[185px] w-full object-cover"/><div className="px-6 pb-7 pt-5 md:px-8"><div className="text-[10px] font-bold uppercase tracking-[.17em] text-[#af6e53]">{modal.kind==='ride'?'Private chauffeur inquiry':mode==='Buy'?'Home viewing inquiry':'Rental home inquiry'}</div><h2 id="inquiry-title" className="serif mt-2 text-[30px] leading-tight">{modal.name}</h2><div className="mt-1 text-[12px] text-[#788078]">{modal.place} <span className="mx-1.5">·</span> {modal.price} {modal.detail}</div><form className="mt-5 grid gap-3" onSubmit={e=>{e.preventDefault();setSubmitted(true)}}><div className="grid gap-3 sm:grid-cols-2"><label className="grid gap-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#66736a]">Your name<input required minLength={2} placeholder="First and last name" className="rounded-xl border border-[#dfdbd0] bg-[#f8f6ef] px-3 py-3 text-[13px] font-normal normal-case tracking-normal outline-none focus:border-[#496959]"/></label><label className="grid gap-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#66736a]">Email address<input type="email" required placeholder="you@example.com" className="rounded-xl border border-[#dfdbd0] bg-[#f8f6ef] px-3 py-3 text-[13px] font-normal normal-case tracking-normal outline-none focus:border-[#496959]"/></label></div><div className="grid gap-3 sm:grid-cols-2"><label className="grid gap-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#66736a]">{modal.kind==='ride'?'Preferred date':mode==='Buy'?'Viewing timeline':'Move-in timing'}<input required type="date" className="rounded-xl border border-[#dfdbd0] bg-[#f8f6ef] px-3 py-3 text-[13px] font-normal normal-case tracking-normal outline-none focus:border-[#496959]"/></label><label className="grid gap-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#66736a]">{modal.kind==='ride'?'Party size':'Bedrooms'}<select className="rounded-xl border border-[#dfdbd0] bg-[#f8f6ef] px-3 py-3 text-[13px] font-normal normal-case tracking-normal outline-none focus:border-[#496959]">{modal.kind==='ride'?<><option>2 people</option><option>1 person</option><option>3 people</option><option>4+ people</option></>:<><option>Any bedrooms</option><option>1 bedroom</option><option>2 bedrooms</option><option>3 bedrooms</option><option>4+ bedrooms</option></>}</select></label></div><label className="grid gap-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#66736a]">A note, if you like<textarea rows={2} placeholder="Tell us a little about what you have in mind..." className="resize-none rounded-xl border border-[#dfdbd0] bg-[#f8f6ef] px-3 py-3 text-[13px] font-normal normal-case tracking-normal outline-none focus:border-[#496959]"/></label><button type="submit" className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-[#28483d] py-3.5 text-[13px] font-semibold text-[#f7f4ea] transition hover:bg-[#1e392f]">{modal.kind==='ride'?'Request this journey':mode==='Buy'?'Ask about this home':'Ask about this rental'} <ArrowUpRight size={15}/></button><p className="text-center text-[10px] leading-4 text-[#899087]">This is a demo. Your details stay here and no real enquiry is sent.</p></form></div></>:<div className="px-7 py-12 text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e7ede5] text-[#345d43]"><CircleCheck size={29}/></span><h2 id="inquiry-title" className="serif mt-5 text-[31px]">A lovely place to start.</h2><p className="mx-auto mt-3 max-w-sm text-[13px] leading-6 text-[#748077]">Your demo inquiry for <strong className="text-[#34483d]">{modal.name}</strong> is ready. In a live service, a local host or driver would be in touch.</p><div className="mx-auto mt-5 flex max-w-xs items-center justify-center gap-2 rounded-xl bg-[#eff0e9] px-4 py-3 text-[11px] text-[#647268]"><Check size={15}/>No details were sent or stored.</div><button onClick={closeModal} className="mt-6 rounded-full bg-[#28483d] px-7 py-3 text-[12px] font-semibold text-white">Back to exploring</button></div>}
      </div>
    </div>}
  </main>;
}
export default App;