import { cn } from "../../utils/cn";

/**
 * Central max-width container with responsive gutters.
 */
export const Container = ({ className, children, ...props }) => (
  <div
    className={cn("mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-20", className)}
    {...props}
  >
    {children}
  </div>
);

export default Container;
