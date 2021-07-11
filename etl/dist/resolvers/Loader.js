"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoaderResolver = void 0;
const sale_1 = require("../entities/sale");
const date_1 = require("../entities/date");
const property_1 = require("../entities/property");
const location_1 = require("../entities/location");
const type_graphql_1 = require("type-graphql");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const csv = __importStar(require("fast-csv"));
let LoaderResponse = class LoaderResponse {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], LoaderResponse.prototype, "success", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], LoaderResponse.prototype, "error", void 0);
LoaderResponse = __decorate([
    type_graphql_1.ObjectType()
], LoaderResponse);
let LoaderResolver = class LoaderResolver {
    salesAllGet() {
        return __awaiter(this, void 0, void 0, function* () {
            const sales = yield sale_1.Sale.find({
                relations: ["date", "location", "property"],
            });
            return sales;
        });
    }
    DeleteData() {
        return __awaiter(this, void 0, void 0, function* () {
            yield sale_1.Sale.delete({});
            yield date_1.Date.delete({});
            yield location_1.Location.delete({});
            yield property_1.Property.delete({});
            return { success: true, error: "" };
        });
    }
    LoadData(name) {
        return __awaiter(this, void 0, void 0, function* () {
            fs.createReadStream(path.resolve(__dirname, "..", "..", "..", "data", name))
                .pipe(csv.parse({ headers: true }))
                .on("error", (error) => console.error(error))
                .on("data", (row) => __awaiter(this, void 0, void 0, function* () {
                const sale = new sale_1.Sale();
                const date = new date_1.Date();
                const location = new location_1.Location();
                const property = new property_1.Property();
                {
                    if (row.SALE_DATE != " -  ") {
                        const rawData = row.SALE_DATE.split(" ")[0];
                        const cutData = rawData.split("-");
                        date.year = parseInt(cutData[0]);
                        date.month = parseInt(cutData[1]);
                        date.day = parseInt(cutData[2]);
                    }
                    else {
                        date.year = -1;
                        date.month = -1;
                        date.day = -1;
                    }
                }
                yield date_1.Date.save(date);
                property.landSquareFeet =
                    row.LAND_SQUARE_FEET != " -  " ? parseInt(row.LAND_SQUARE_FEET) : -1;
                property.taxClass =
                    row.TAX_CLASS_AT_PRESENT != " -  "
                        ? row.TAX_CLASS_AT_PRESENT
                        : "undefined";
                property.yearBuild =
                    row.YEAR_BUILT != " -  " ? parseInt(row.YEAR_BUILT) : -1;
                yield property_1.Property.save(property);
                location.borough = row.BOROUGH != " -  " ? parseInt(row.BOROUGH) : -1;
                location.neighborhood =
                    row.NEIGHBORHOOD != " -  " ? row.NEIGHBORHOOD : "undefined";
                location.zipCode = row.ZIP_CODE != " -  " ? row.ZIP_CODE : "undefined";
                yield location_1.Location.save(location);
                sale.date = date;
                sale.location = location;
                sale.property = property;
                yield sale_1.Sale.save(sale);
            }))
                .on("end", (rowCount) => __awaiter(this, void 0, void 0, function* () {
                console.log(`Parsed ${rowCount} rows`);
            }));
            return { success: true, error: "" };
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [sale_1.Sale], { nullable: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LoaderResolver.prototype, "salesAllGet", null);
__decorate([
    type_graphql_1.Mutation(() => LoaderResponse),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LoaderResolver.prototype, "DeleteData", null);
__decorate([
    type_graphql_1.Mutation(() => LoaderResponse),
    __param(0, type_graphql_1.Arg("name", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoaderResolver.prototype, "LoadData", null);
LoaderResolver = __decorate([
    type_graphql_1.Resolver(sale_1.Sale)
], LoaderResolver);
exports.LoaderResolver = LoaderResolver;
//# sourceMappingURL=Loader.js.map