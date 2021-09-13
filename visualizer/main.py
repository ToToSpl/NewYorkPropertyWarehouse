from collections import defaultdict

from gql import Client, gql
from gql.transport.requests import RequestsHTTPTransport
from matplotlib import pyplot as plt


def price_to_build_year(client):
    query = gql("""
    query {
        salesAllGet {
            property {
                yearBuild
            }
            salePrice
        }
    }
    """)
    result = client.execute(query)["salesAllGet"]

    def def_value():
        return [0.0, 0.0]
    year_prices = defaultdict(def_value)

    years = []
    prices = []
    for entry in result:
        year = int(entry["property"]["yearBuild"])
        price = int(entry["salePrice"])
        if year > 1500 and price > 100:
            rounded_year = year - (year % 10)
            average = year_prices[rounded_year]
            average[0] += 1
            average[1] += price

    for i in range(1500, 2050, 10):
        if year_prices[i][0] == 0:
            continue
        price_avg = year_prices[i][1] / year_prices[i][0]
        years.append(i)
        prices.append(price_avg)

    return years, prices


def price_to_zipcode(client):
    query = gql("""
    query {
        salesAllGet {
            location {
                zipCode
            }
            salePrice
        }
    }
    """)
    result = client.execute(query)["salesAllGet"]

    def def_value():
        return [0.0, 0.0]
    zipcodes_prices = defaultdict(def_value)

    prices = []
    zipcodes = []
    for entry in result:
        zipcode = int(entry["location"]["zipCode"])
        price = int(entry["salePrice"])
        if zipcode != "undefined" and price > 100:
            if int(zipcode) == 0:
                continue
            average = zipcodes_prices[int(zipcode)]
            average[0] += 1
            average[1] += price

    for key, value in zipcodes_prices.items():
        price_avg = value[1] / value[0]
        zipcodes.append(key)
        prices.append(price_avg)

    return zipcodes, prices


def price_to_area(client):
    query = gql("""
    query {
        salesAllGet {
            property {
                landSquareFeet
            }
            salePrice
        }
    }
    """)
    result = client.execute(query)["salesAllGet"]

    def def_value():
        return [0.0, 0.0]
    areas_prices = defaultdict(def_value)

    areas = []
    prices = []
    for entry in result:
        area = int(entry["property"]["landSquareFeet"])
        price = int(entry["salePrice"])
        if area > 10000 and price > 100:
            rounded_area = area - (area % 250)
            average = areas_prices[rounded_area]
            average[0] += 1
            average[1] += price

    for i in range(10000, 17000, 250):
        if areas_prices[i][0] == 0:
            continue
        price_avg = areas_prices[i][1] / areas_prices[i][0]
        areas.append(i)
        prices.append(price_avg)

    return areas, prices


def zipcode_to_yearbuilt(client):
    query = gql("""
    query {
      salesAllGet {
        property {
          yearBuild
        }
        location {
          zipCode
        }
      }
    }
    """)
    result = client.execute(query)["salesAllGet"]

    def def_value():
        return [0.0, 0.0]
    zipcodes_yearbuilts = defaultdict(def_value)

    zipcodes = []
    yearbuilts = []
    for entry in result:
        zipcode = int(entry["location"]["zipCode"])
        year = int(entry["property"]["yearBuild"])
        if zipcode != "undefined" and year > 1500:
            if int(zipcode) == 0:
                continue
            average = zipcodes_yearbuilts[int(zipcode)]
            average[0] += 1
            average[1] += year

    for key, value in zipcodes_yearbuilts.items():
        yearbuilt_avg = value[1] / value[0]
        zipcodes.append(key)
        yearbuilts.append(yearbuilt_avg)

    return zipcodes, yearbuilts


def main():
    transport = RequestsHTTPTransport(url="http://localhost:4000/graphql")
    client = Client(transport=transport, fetch_schema_from_transport=True)

    plt.figure(1, figsize=(800, 800))
    ax = plt.gca()
    ax.get_xaxis().get_major_formatter().set_useOffset(False)
    ax.ticklabel_format(useOffset=False, style='plain')

    subplot_1 = plt.subplot(221)
    subplot_1.axes.ticklabel_format(
        style='plain', useOffset=False, axis='both')
    plt.bar(*price_to_build_year(client), width=5)
    plt.title("Price of property depending on the year")
    plt.xlabel("year")
    plt.ylabel("price")

    subplot_2 = plt.subplot(222)
    subplot_2.axes.ticklabel_format(
        style='plain', useOffset=False, axis='both')
    plt.bar(*price_to_zipcode(client), width=5)
    plt.title("Price of property depending on the zipcode")
    plt.xlabel("zipcode")
    plt.ylabel("price")

    subplot_3 = plt.subplot(223)
    subplot_3.axes.ticklabel_format(
        style='plain', useOffset=False, axis='both')
    plt.bar(*price_to_area(client), width=5)
    plt.title("Price of property depending on the area")
    plt.xlabel("area")
    plt.ylabel("price")

    subplot_4 = plt.subplot(224)
    subplot_4.axes.ticklabel_format(
        style='plain', useOffset=False, axis='both')
    plt.ylim([1900, 2050])
    plt.bar(*zipcode_to_yearbuilt(client), width=5)
    plt.title("Yearbuilt depending on the zipcode")
    plt.xlabel("zipcode")
    plt.ylabel("yearbuilt")

    plt.show()


if __name__ == "__main__":
    main()
