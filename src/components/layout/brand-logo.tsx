import Image from "next/image";

export const BrandLogo = () => (
  <div className="flex items-center gap-1 group select-none">
    <Image
      width={40} // Optimized size
      height={40}
      src="/logo.png"
      alt="YassAuto Logo"
      className="w-20 h-20 object-contain"
      priority // Important for LCP (Largest Contentful Paint)
    />
    <div className="flex flex-col justify-center -space-y-1">
      <span className="text-xl font-black text-white tracking-tighter italic leading-none">
        YASS<span className="text-brand-red">AUTO</span>
      </span>
    </div>
  </div>
);