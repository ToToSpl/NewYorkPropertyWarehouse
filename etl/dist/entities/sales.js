"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sale = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const date_1 = require("./date");
const location_1 = require("./location");
const property_1 = require("./property");
let Sale = class Sale extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Sale.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(() => date_1.Date),
    typeorm_1.OneToOne(() => date_1.Date),
    typeorm_1.JoinColumn(),
    __metadata("design:type", date_1.Date)
], Sale.prototype, "date", void 0);
__decorate([
    type_graphql_1.Field(() => property_1.Property),
    typeorm_1.OneToOne(() => property_1.Property),
    typeorm_1.JoinColumn(),
    __metadata("design:type", property_1.Property)
], Sale.prototype, "property", void 0);
__decorate([
    type_graphql_1.Field(() => location_1.Location),
    typeorm_1.OneToOne(() => location_1.Location),
    typeorm_1.JoinColumn(),
    __metadata("design:type", location_1.Location)
], Sale.prototype, "location", void 0);
Sale = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], Sale);
exports.Sale = Sale;
//# sourceMappingURL=sales.js.map