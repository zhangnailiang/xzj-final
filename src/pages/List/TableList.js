import React, { PureComponent } from 'react';
import {
  Chart,
  Tooltip,
  Legend,
  Facet,
  G2,
  Geom,
  Axis,
  Coord,
  Label,
  View,
  Guide,
  Shape,
  Util
} from "bizcharts";
import {
  Card,
  Row,
  Col
} from 'antd';
import DataSet from "@antv/data-set";
import { API } from '@/api/index'
import { cloneDeep } from "lodash"

class TableList extends PureComponent {
  state = {
    itemTypeContrastCount: [],
    itemTypeContrastLastCount: [],
    proFitAnalysis: [],
    countAnalysis: [],
    amountAnalysis: [],
    typeIdArr: [],
    typeIdArrAmount: []
  };
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
      let itemTypeContrastCount = [];
      res.data.some((item, index) => {
        if (index === 10) {
          return true
        }
        itemTypeContrastCount.push({
          year: '数量',
          area: item.key,
          profit: item.value
        })

      })
      this.setState({
        itemTypeContrastCount
      })
    });

    API.displayLocationSaleCountUsingGet({
      "controlItem": "empty",
      "controlItemType": "empty",
      "controlItemBigType": "empty",
      "controlLocation": "empty",
      "controlSex": "empty",
      "controlSize": "empty",
      "from": "2018-01-10",
      "to": "2019-01-10",
      "xType": "itemType",
      "xValue": "empty",
      "yValue": "sale-count",
    }).then(res => {
      let itemTypeContrastLastCount = []
      res.data.some((item, index) => {
        if (index === 10) {
          return true
        }
        itemTypeContrastLastCount.push({
          year: '上年数量',
          area: item.key,
          profit: item.value
        });


      })
      this.setState({
        itemTypeContrastLastCount,
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
      "xType": "itemType",
      "xValue": "empty",
      "yValue": "sale-profit",
    }).then(res => {
      let proFitAnalysis = []
      res.data.some((item, index) => {
        if (index === 8) {
          return true
        }
        proFitAnalysis.push({
          item: item.key,
          a: item.value
        });
      })
      this.setState({
        proFitAnalysis,
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
      "xType": "itemType",
      "xValue": "empty",
      "yValue": "sale-count",
    }).then(res => {
      let countAnalysis = []
      res.data.some((item, index) => {
        if (index === 8) {
          return true
        }
        countAnalysis.push({
          item: item.key,
          b: item.value
        });
      })
      this.setState({
        countAnalysis,
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
      "xType": "itemType",
      "xValue": "empty",
      "yValue": "sale-amount",
    }).then(res => {
      let amountAnalysis = []
      res.data.some((item, index) => {
        if (index === 8) {
          return true
        }
        amountAnalysis.push({
          item: item.key,
          d: item.value
        });
      })
      this.setState({
        amountAnalysis,
      })
    });

    /**
     * 获取不同类别的产品  每周的销售额
     */
    API.listTypeUsingGet().then(res => {

      this.setState({
        typeIdArr: res.data
      })

    })
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= 12; i++) {
      API.displayLocationSaleCountUsingGet({
        "controlItem": "empty",
        "controlItemType": i,
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
        const { typeIdArrAmount } = this.state;

        let newtypeIdArrAmount = [{}]
        res.data.forEach((item, index) => {
          let newitem = index + 1
          newtypeIdArrAmount[0][newitem] = item.value
        })

        console.log("new", newtypeIdArrAmount)
        this.setState({
          typeIdArrAmount: cloneDeep(typeIdArrAmount).concat(newtypeIdArrAmount)
        })
      });
    }
  }



  render() {
    const { itemTypeContrastCount, itemTypeContrastLastCount, proFitAnalysis, countAnalysis, amountAnalysis, typeIdArrAmount } = this.state;
    let itemTypeContrastTb = [];
    // eslint-disable-next-line no-plusplus
    const { DataView } = DataSet;
    console.log("old", typeIdArrAmount)
    /**
     * 品类对比
     */
    cloneDeep(itemTypeContrastCount).some((item, index) => {
      if (index === 10) {
        return true
      }
      itemTypeContrastTb.push(Object.assign(item, { year: "数量同比" }, { profit: 1 }))
    })

    const dvp = new DataView().source(proFitAnalysis);
    dvp.transform({
      type: "fold",
      fields: ["a"],
      // 展开字段集
      key: "user",
      // key字段
      value: "score" // value字段
    });
    const cols = {
      score: {
        min: 0,
        max: 38000000
      }
    };

    const dvc = new DataView().source(countAnalysis);
    dvc.transform({
      type: "fold",
      fields: ["b"],
      // 展开字段集
      key: "user",
      // key字段
      value: "score" // value字段
    });
    const colsc = {
      score: {
        min: 0,
        max: 30000
      }
    };

    const dva = new DataView().source(amountAnalysis);
    dva.transform({
      type: "fold",
      fields: ["d"],
      // 展开字段集
      key: "user",
      // key字段
      value: "score" // value字段
    });
    const colsa = {
      score: {
        min: 0,
        max: 150000000
      }
    };

    /**
     * 品类销售同比
     */
    const data = [
      {
        name: "London",
        "Jan.": 18.9,
        "Feb.": 28.8,
        "Mar.": 39.3,
        "Apr.": 81.4,
        May: 47,
        "Jun.": 20.3,
        "Jul.": 24,
        "Aug.": 35.6
      },
      {
        name: "Berlin",
        "Jan.": 12.4,
        "Feb.": 23.2,
        "Mar.": 34.5,
        "Apr.": 99.7,
        May: 52.6,
        "Jun.": 35.5,
        "Jul.": 37.4,
        "Aug.": 42.4
      }
    ];
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    let newFiledArr = [];
    dv.transform({
      type: "fold",
      fields: ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug."],
      // 展开字段集
      key: "月份",
      // key字段
      value: "月均降雨量" // value字段
    });
    return (
      <div>

        <Card title="品类对比" bordered={false} style={{ width: "100%", marginBottom: "20px" }}>
          <Chart data={itemTypeContrastCount.concat(itemTypeContrastLastCount, itemTypeContrastTb)} padding={'auto'} forceFit>
            <Tooltip showTitle={false} />
            <Legend offsetY={60} />
            <Facet
              type="rect"
              fields={["year"]}
              padding={50}
              colTitle={{
                offsetY: -30,
                style: {
                  fontSize: 18,
                  textAlign: "center",
                  fill: "#999"
                }
              }}
              eachView={(view, facet) => {
                const data = facet.data;
                const dv = new DataView();
                dv.source(data).transform({
                  type: "percent",
                  field: "profit",
                  dimension: "area",
                  as: "percent"
                });
                view.source(dv, {
                  percent: {
                    formatter: val => {
                      return (val * 100).toFixed(2) + "%";
                    }
                  }
                });
                view.coord("theta", {
                  innerRadius: 0.35
                });
                view
                  .intervalStack()
                  .position("percent")
                  .color("area")
                  .label("percent", {
                    offset: -8
                  })
                  .style({
                    lineWidth: 1,
                    stroke: "#fff"
                  });
              }}
            />
          </Chart>
        </Card>
        <Row>
          <Col span={8}>
            <Card title="利润分析" bordered={false} style={{ width: "33", marginBottom: "20px", marginRight: "10px" }}>
              <Chart
                data={dvp}
                padding={[20, 20, 95, 20]}
                scale={cols}
                forceFit
              >
                <Coord type="polar" radius={0.7} />
                <Axis
                  name="item"
                  line={null}
                  tickLine={null}
                  grid={{
                    lineStyle: {
                      lineDash: null
                    },
                    hideFirstLine: false
                  }}
                />
                <Tooltip />
                <Axis
                  name="score"
                  line={null}
                  tickLine={null}
                  grid={{
                    type: "polygon",
                    lineStyle: {
                      lineDash: null
                    },
                    alternateColor: "rgba(0, 0, 0, 0.04)"
                  }}
                />
                <Legend name="user" marker="circle" offset={30} />
                <Geom type="area" position="item*score" color="user" />
                <Geom type="line" position="item*score" color="user" size={2} />
                <Geom
                  type="point"
                  position="item*score"
                  color="user"
                  shape="circle"
                  size={4}
                  style={{
                    stroke: "#fff",
                    lineWidth: 1,
                    fillOpacity: 1
                  }}
                />
              </Chart>

            </Card>
          </Col>
          <Col span={8}>
            <Card title="数量分析" bordered={false} style={{ width: "33", marginBottom: "20px", marginRight: "20px" }}>
              <Chart
                data={dvc}
                padding={[20, 20, 95, 20]}
                scale={colsc}
                forceFit
              >
                <Coord type="polar" radius={0.7} />
                <Axis
                  name="item"
                  line={null}
                  tickLine={null}
                  grid={{
                    lineStyle: {
                      lineDash: null
                    },
                    hideFirstLine: false
                  }}
                />
                <Tooltip />
                <Axis
                  name="score"
                  line={null}
                  tickLine={null}
                  grid={{
                    type: "polygon",
                    lineStyle: {
                      lineDash: null
                    },
                    alternateColor: "rgba(0, 0, 0, 0.04)"
                  }}
                />
                <Legend name="user" marker="circle" offset={30} />
                <Geom type="area" position="item*score" color="user" />
                <Geom type="line" position="item*score" color="user" size={2} />
                <Geom
                  type="point"
                  position="item*score"
                  color="user"
                  shape="circle"
                  size={4}
                  style={{
                    stroke: "#fff",
                    lineWidth: 1,
                    fillOpacity: 1
                  }}
                />
              </Chart>

            </Card>
          </Col>
          <Col span={8}>
            <Card title="销售额分析" bordered={false} style={{ width: "33", marginBottom: "20px" }}>
              <Chart
                data={dva}
                padding={[20, 20, 95, 20]}
                scale={colsa}
                forceFit
              >
                <Coord type="polar" radius={0.7} />
                <Axis
                  name="item"
                  line={null}
                  tickLine={null}
                  grid={{
                    lineStyle: {
                      lineDash: null
                    },
                    hideFirstLine: false
                  }}
                />
                <Tooltip />
                <Axis
                  name="score"
                  line={null}
                  tickLine={null}
                  grid={{
                    type: "polygon",
                    lineStyle: {
                      lineDash: null
                    },
                    alternateColor: "rgba(0, 0, 0, 0.04)"
                  }}
                />
                <Legend name="user" marker="circle" offset={30} />
                <Geom type="area" position="item*score" color="user" />
                <Geom type="line" position="item*score" color="user" size={2} />
                <Geom
                  type="point"
                  position="item*score"
                  color="user"
                  shape="circle"
                  size={4}
                  style={{
                    stroke: "#fff",
                    lineWidth: 1,
                    fillOpacity: 1
                  }}
                />
              </Chart>

            </Card>
          </Col>
        </Row>
        <Card title="品类销售同比" bordered={false} style={{ width: "100%", marginBottom: "20px" }}>
          <Chart height={400} data={dv} forceFit>
            <Axis name="月份" />
            <Axis name="月均降雨量" />
            <Legend />
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Geom
              type="interval"
              position="月份*月均降雨量"
              color={"name"}
              adjust={[
                {
                  type: "dodge",
                  marginRatio: 1 / 32
                }
              ]}
            />
          </Chart>
        </Card>

      </div>
    );
  }
}

export default TableList;
