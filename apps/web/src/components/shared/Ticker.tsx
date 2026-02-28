export const Ticker = () => {
  return (
    <div className="bg-rawr-red text-rawr-white h-10 flex items-center overflow-hidden whitespace-nowrap border-b-2 border-rawr-black z-50 relative">
      <div className="animate-marquee flex gap-12 text-sm font-bold uppercase tracking-widest pl-4">
        {/* Static + Dynamic Content will be mixed here in V2 */}
        <span>FREE SHIPPING WORLDWIDE ON ORDERS OVER $50</span>
        <span>•</span>
        <span>NEW DROP THIS FRIDAY 9PM EST</span>
        <span>•</span>
        <span>LIMITED QUANTITIES</span>
        <span>•</span>
        <span>NO RESTOCKS EVER</span>
        <span>•</span>
        <span>FREE SHIPPING WORLDWIDE ON ORDERS OVER $50</span>
        <span>•</span>
        <span>NEW DROP THIS FRIDAY 9PM EST</span>
        <span>•</span>
        <span>LIMITED QUANTITIES</span>
        <span>•</span>
        <span>NO RESTOCKS EVER</span>
      </div>
    </div>
  );
};
