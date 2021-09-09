from collections import defaultdict
from gql import Client, gql
from gql.transport.requests import RequestsHTTPTransport
from matplotlib import pyplot as plt
import numpy as np


def main():
    transport = RequestsHTTPTransport(url="http://localhost:4000/graphql")
    client = Client(transport=transport, fetch_schema_from_transport=True)
    query = gql("""
    query {
        salesAllGet {
            date {
                day
                month
                year
            }
            property {
                taxClass
                landSquareFeet
                yearBuild
            }
            location {
                borough
                zipCode
                neighborhood
            }
        }
    }""")
    # result = client.execute(query)

    # does the price depends on the year build?
    query_1 = gql("""
    query {
        salesAllGet {
            property {
                yearBuild
            }
            salePrice
        }
    }
    """)
    result_1 = client.execute(query_1)["salesAllGet"]
    def def_value():
        return [0.0, 0.0]
    year_prices = defaultdict(def_value)

    years = []
    prices = []
    for entry in result_1:
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
    
    plt.bar(years, prices, width=5)
    plt.show()


    # {'property': {'yearBuild': -1}, 'salePrice': -1}

    # does the price depends on the zipcode? (location)
    query_2 = gql("""
    query {
        salesAllGet {
            location {
                zipCode
            }
            salePrice
        }
    }
    """)
    #result_2 = client.execute(query_2)

    # TODO: wykresiki
    # cena od landsquare feet
    # avg yearbuild od zipcode


if __name__ == "__main__":
    main()
