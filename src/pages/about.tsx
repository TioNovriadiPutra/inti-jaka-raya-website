import { Breadcrumb, Flex } from "@/components/shared";
import { aboutSection2Data } from "@/utils/constant";

const About = () => {
  return (
    <Flex className="grow basis-0">
      {/* Section 1 */}
      <Flex className="px-3.5 pt-10 pb-32.5 bg-[rgba(0,0,0,0.4)] gap-16">
        <Breadcrumb pages={["Home", "About Us"]} />

        <h1 className="text-white text-shadow-[2px_4px_24px_rgb(0_0_0/0.25)">
          We are committed to providing the best products & services
        </h1>
      </Flex>

      {/* Section 2 */}
      <Flex className="px-3.5 py-16 bg-neutral-50">
        <p className="text-body-xs text-accent-600">What we do</p>

        <h4 className="text-neutral-800 mb-10">
          Delivering The Finest Industrial Maintenance Solution
        </h4>

        <p className="text-body-s text-neutral-500 text-justify">
          PT INTI JAKARAYA was established in 2017 located in Bandung West Java
          – Indonesia. PT INTI JAKARAYA is a Sole Distributor for UNIQUE POLYMER
          SYSTEMS Made in UK, in Indonesia.
          <br />
          <br />
          PT INTI JAKARAYA provides innovative business solution to our
          customers that have fluid flow system problems, such as : erosion,
          corrosion, cavitation, dry abrasive, chemical attack concrete problem,
          floor protection and etc.
        </p>
      </Flex>

      {/* Section 3 */}
      <Flex className="px-3.5 py-16 bg-white -mt-px">
        <p className="text-body-xs text-accent-600">Our Mission</p>

        <h4 className="text-neutral-800 mb-22">
          We Are Dedicated To Offering The Test Goods And Services.
        </h4>

        <Flex className="gap-8">
          {aboutSection2Data.map((item, index) => {
            const Icon = item.icon;

            return (
              <Flex
                key={index.toString()}
                className={`w-full h-70.75 justify-center px-6 border border-neutral-200 rounded-2xl`}
              >
                <Flex className="size-14 bg-white rounded-[14px] shadow-[2px_2px_24px_rgba(0,0,0,0.1)] items-center justify-center mb-6">
                  <Icon />
                </Flex>

                <h5 className="font-semibold text-neutral-800 mb-3.5">
                  {item.title}
                </h5>

                <p className="text-body-s text-neutral-500">
                  {item.description}
                </p>
              </Flex>
            );
          })}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default About;
