import { Hero } from "@/components/sections/Hero";
import { ExperienceMap } from "@/components/sections/ExperienceMap";
import { Categories } from "@/components/sections/Categories";
import { Timeline } from "@/components/sections/Timeline";
import { Prizes } from "@/components/sections/Prizes";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Timeline />
      <Prizes />
      <ExperienceMap />
    </>
  );
}
