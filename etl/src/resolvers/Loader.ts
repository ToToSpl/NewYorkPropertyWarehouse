import { Sale } from "../entities/sale";
import { Date } from "../entities/date";
import { Property } from "../entities/property";
import { Location } from "../entities/location";
import {
  Arg,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import * as fs from "fs";
import * as path from "path";
import * as csv from "fast-csv";

@ObjectType()
class LoaderResponse {
  @Field()
  success: boolean;

  @Field()
  error: string;
}

@Resolver(Sale)
export class LoaderResolver {
  @Query(() => [Sale], { nullable: true })
  async salesAllGet(): Promise<Sale[]> {
    const sales = await Sale.find({
      relations: ["date", "location", "property"],
    });
    return sales;
  }

  @Mutation(() => LoaderResponse)
  async DeleteData(): Promise<LoaderResponse> {
    await Sale.delete({});
    await Date.delete({});
    await Location.delete({});
    await Property.delete({});
    return { success: true, error: "" };
  }

  @Mutation(() => LoaderResponse)
  async LoadData(
    @Arg("name", () => String) name: string
  ): Promise<LoaderResponse> {
    fs.createReadStream(path.resolve(__dirname, "..", "..", "..", "data", name))
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => console.error(error))
      .on("data", async (row) => {
        const sale = new Sale();
        const date = new Date();
        const location = new Location();
        const property = new Property();
        {
          if (row.SALE_DATE != " -  ") {
            const rawData = row.SALE_DATE.split(" ")[0];
            const cutData = rawData.split("-");
            date.year = parseInt(cutData[0]);
            date.month = parseInt(cutData[1]);
            date.day = parseInt(cutData[2]);
          } else {
            date.year = -1;
            date.month = -1;
            date.day = -1;
          }
        }
        await Date.save(date);

        property.landSquareFeet =
          row.LAND_SQUARE_FEET != " -  " ? parseInt(row.LAND_SQUARE_FEET) : -1;
        property.taxClass =
          row.TAX_CLASS_AT_PRESENT != " -  "
            ? row.TAX_CLASS_AT_PRESENT
            : "undefined";
        property.yearBuild =
          row.YEAR_BUILT != " -  " ? parseInt(row.YEAR_BUILT) : -1;
        await Property.save(property);

        location.borough = row.BOROUGH != " -  " ? parseInt(row.BOROUGH) : -1;
        location.neighborhood =
          row.NEIGHBORHOOD != " -  " ? row.NEIGHBORHOOD : "undefined";
        location.zipCode = row.ZIP_CODE != " -  " ? row.ZIP_CODE : "undefined";
        await Location.save(location);

        sale.date = date;
        sale.location = location;
        sale.property = property;
        sale.salePrice = row.SALE_PRICE != " -  " ? row.SALE_PRICE : -1;
        await Sale.save(sale);
      })
      .on("end", async (rowCount: number) => {
        console.log(`Parsed ${rowCount} rows`);
      });
    return { success: true, error: "" };
  }
}
