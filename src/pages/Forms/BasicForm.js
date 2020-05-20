import React, { PureComponent } from 'react';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";
import {
  Bar,

} from '@/components/Charts';
import { Card } from 'antd';
import { API } from '@/api/index'
class Basiccolumn extends PureComponent {
  state = {
    itemTypeSales: [],
    eachWeekSales: [],
    eachWeekProfit: [],
  }
  componentDidMount() {
    API.displayLocationSaleCountUsingGet({
      "controlItem": "empty",
      "controlItemType": "empty",
      "controlItemBigType": "empty",
      "controlLocation": "empty",
      "controlSex": "empty",
      "controlSize": "empty",
      "from": "2019-01-10",
      "to": "2020-01-10",
      "xType": "itemType",
      "xValue": "empty",
      "yValue": "sale-count",
    }).then(res => {
      let itemTypeSales = [];

      res.data.some((item, index) => {
        if (index === 30) {
          return true
        }
        itemTypeSales.push({
          x: item.key,
          y: item.value
        })
      })
      this.setState({
        itemTypeSales
      })
    });
    API.displayLocationSaleCountUsingGet({
      "controlItem": "empty",
      "controlItemType": "empty",
      "controlItemBigType": "empty",
      "controlLocation": "empty",
      "controlSex": "empty",
      "controlSize": "empty",
      "from": "2019-01-10",
      "to": "2020-01-10",
      "xType": "date",
      "xValue": "week",
      "yValue": "sale-amount",
    }).then(res => {
      this.setState({
        eachWeekSales: res.data
      })
    })
    API.displayLocationSaleCountUsingGet({
      "controlItem": "empty",
      "controlItemType": "empty",
      "controlItemBigType": "empty",
      "controlLocation": "empty",
      "controlSex": "empty",
      "controlSize": "empty",
      "from": "2019-01-10",
      "to": "2020-01-10",
      "xType": "date",
      "xValue": "week",
      "yValue": "sale-profit",
    }).then(res => {
      this.setState({
        eachWeekProfit: res.data
      })
    })
  }
  render() {
    const { itemTypeSales, eachWeekSales, eachWeekProfit } = this.state;
    console.log(itemTypeSales);
    let SalesProfitWeek = [];
    eachWeekSales.forEach((item, index) => {
      SalesProfitWeek.push({
        month: `${index + 1}周`,
        city: "销售额",
        temperature: item.value
      })
    });
    eachWeekProfit.forEach((item, index) => {
      SalesProfitWeek.push({
        month: `${index + 1}周`,
        city: "利润",
        temperature: item.value
      })
    })
    console.log(SalesProfitWeek)
    const cols1 = {
      month: {
        range: [0, 1]
      }
    };
    return (
      <div>
        <Card title="商品种类销售数量对比" bordered={false} style={{ width: "100%", marginBottom: "20px" }}>
          <Bar height={295} data={itemTypeSales} />
        </Card>
        <Card title="销售额利润对比" bordered={false} style={{ width: "100%" }}>
          <Chart height={400} data={SalesProfitWeek} scale={cols1} forceFit>
            <Legend />
            <Axis name="month" />
            <Axis
              name="temperature"
              label={{
                formatter: val => `${val}`
              }}
            />
            <Tooltip
              crosshairs={{
                type: "y"
              }}
              custom={true}
              containerTpl={`
          <div class="g2-tooltip"><div class="g2-tooltip-title" style="margin-bottom: 4px;"></div>
          <table>
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>名称</td>
                <th>值</td>
              </tr>
            <thead>
            <tbody
              class="g2-tooltip-list"
            >
            </tbody>
          <table>
          `}

              itemTpl={`
            <tr data-index={index}>'
              <td><span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span></td>
              <td>{name}</td>
              <td>{value}</td>
            </tr>
         `}

            />
            <Geom
              type="line"
              position="month*temperature"
              size={2}
              color={"city"}
              shape={"smooth"}
            />
            <Geom
              type="point"
              position="month*temperature"
              size={4}
              shape={"circle"}
              color={"city"}
              style={{
                stroke: "#fff",
                lineWidth: 1
              }}
            />
          </Chart>
        </Card>

      </div>
    );
  }
}



export default Basiccolumn;
