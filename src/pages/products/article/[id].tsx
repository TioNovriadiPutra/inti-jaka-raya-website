import useTranslation from "@/hooks/useTranslation";
import { Breadcrumb, Flex } from "@/components/shared";
import Image from "next/image";

const ProductArticle = () => {
  const { t } = useTranslation();
  return (
    <Flex className="grow basis-0 bg-white">
      {/* Section 1 */}
      <Flex className="px-3.5 py-6">
        <Breadcrumb pages={["Home", "Products", "UPS 105 EG"]} color="dark" />
      </Flex>

      {/* Section 2 */}
      <Flex className="p-3.5 gap-10">
        <Flex>
          <Flex className="px-4 pt-4 pb-10 bg-neutral-50 border-x border-t border-neutral-200 rounded-t-lg gap-3.5">
            <p className="text-body-s font-semibold text-accent-600">{t("UPS 105 EG")}</p>

            <h3 className="font-bold text-neutral-800">{t("THISTLEBOND METAL REPAIR PASTE")}</h3>
          </Flex>

          <Image
            src="/images/products.png"
            alt={t("Product")}
            width={500}
            height={333}
            className="w-83 h-[226.5px] object-cover object-center rounded-b-lg"
          />
        </Flex>

        <Flex className="gap-4.5">
          <h4 className="text-neutral-800">{t("Title")}</h4>

          <p className="text-body-s text-neutral-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            hendrerit posuere sem, vel aliquam arcu. Mauris commodo orci sed
            ultricies posuere. Pellentesque sed facilisis sapien. Vestibulum et
            ante porttitor turpis sollicitudin consequat. Duis aliquam, eros ac
            faucibus volutpat, nunc lectus consequat felis, vitae venenatis
            massa lectus a risus. Donec sit amet arcu a eros imperdiet finibus.
            Donec eu odio vel velit vestibulum euismod nec et risus. Quisque
            posuere magna id hendrerit iaculis. Sed vitae sapien id odio
            ullamcorper vulputate eget id elit. Integer a ipsum sit amet ante
            semper ornare. Nunc vel erat ipsum. Mauris id porta turpis.
          </p>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProductArticle;
