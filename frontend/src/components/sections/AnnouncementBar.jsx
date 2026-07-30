import Marquee from "react-fast-marquee";
import { announcements } from "../../data/content";

/**
 * Slow editorial announcement marquee.
 */
export const AnnouncementBar = () => (
  <div
    className="w-full bg-brand-accent py-2.5 text-white"
    data-testid="announcement-bar"
  >
    <Marquee speed={38} gradient={false} autoFill pauseOnHover>
      {announcements.map((a, i) => (
        <span
          key={i}
          className="mx-8 inline-flex items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.28em]"
        >
          {a}
          <span className="text-white/60">✦</span>
        </span>
      ))}
    </Marquee>
  </div>
);

export default AnnouncementBar;
