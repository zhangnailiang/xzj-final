import React, { Component } from 'react';
import { Card } from 'antd';
import { Chart, Axis, Tooltip, Geom, Legend } from 'bizcharts';
import DataSet from '@antv/data-set';
import { isEmpty } from "lodash"
import { API } from '@/api/index'

class BasicProfile extends Component {
  state = {
    saleContrastArrOne: [],
    saleContrastArrTwo: [],
    nowCountArr: []
  }
  componentDidMount() {
    this.huoquduibishujuThis();
    this.huoquduibishujulast();
    this.huoquitemcount(1);

  }
  huoquitemcount = (i) => {
    console.log(i)
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
      "yValue": "sale-count",
    }).then(res => {
      let nowCountArr = [];
      res.data.forEach((item, index) => {
        nowCountArr.push({
          year: `${index + 1}`,
          value: item.value
        })
      })
      this.setState({
        nowCountArr
      })
    })
  }
  huoquduibishujuThis = () => {
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
      let saleContrastArrOne = [];
      res.data.some((item, index) => {
        if (index === 12) {
          return true
        }
        saleContrastArrOne.push(item)
      })
      this.setState({
        saleContrastArrOne
      })
    })

  }
  huoquduibishujulast = () => {
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
      let saleContrastArrTwo = [];
      res.data.some((item, index) => {
        if (index === 12) {
          return true
        }
        saleContrastArrTwo.push(item)
      })
      this.setState({
        saleContrastArrTwo
      })
    })

  }

  render() {
    const { saleContrastArrTwo, saleContrastArrOne, nowCountArr } = this.state
    console.log(saleContrastArrOne, saleContrastArrTwo, nowCountArr);
    console.log("nowCountArr", nowCountArr);

    let saleContrastArr = [];
    if (!isEmpty(saleContrastArrTwo) && !isEmpty(saleContrastArrOne)) {
      saleContrastArrOne.forEach((item, index) => {
        saleContrastArr.push({
          "label": item.key,
          "销售数量": item.value,
          "上年销售数量": saleContrastArrTwo[index].value,
          "销售数量同比": parseFloat(item.value) / parseFloat(saleContrastArrTwo[index].value),
          "id": `${index + 1}`
        })
      })
    }

    console.log(saleContrastArr)
    const ds = new DataSet();
    const dv = ds.createView().source(saleContrastArr);
    dv.transform({
      type: 'fold',
      fields: ['销售数量', '上年销售数量'], // 展开字段集
      key: 'type', // key字段
      value: 'value', // value字段
    });
    const scale = {
      销售数量同比: {
        type: 'linear',
        min: 0,
        max: 2,
      },
    };

    let chartIns = null;

    const getG2Instance = (chart) => {
      chartIns = chart;
    };


    /**
     * 折线图
     */

    const cols = {
      value: {
        min: 0,
        range: [0, 0.93],
        alias: '数量'
      },
      year: {
        range: [0, 0.95],
        alias: '周'
      }
    };
    return (
      <div>
        <Card title="品类销售同比" bordered={false} style={{ width: "100%", marginBottom: "20px" }}>
          <Chart
            height={400}
            width={500}
            forceFit
            data={dv}
            scale={scale}
            padding="auto"
            onGetG2Instance={getG2Instance}
            onPlotClick={(ev) => {
              console.log(ev);
              this.huoquitemcount(ev.data._origin.id)
            }}
          >
            <Legend
              style={{ cursor: "point" }}
              custom
              allowAllCanceled
              items={[
                { value: '销售数量', marker: { symbol: 'square', fill: '#3182bd', radius: 5 } },
                { value: '上年销售数量', marker: { symbol: 'square', fill: '#41a2fc', radius: 5 } },
                { value: '销售数量同比', marker: { symbol: 'hyphen', stroke: '#fad248', radius: 5, lineWidth: 3 } },
              ]}
              onClick={(ev) => {
                const item = ev.item;


                const value = item.value;
                const checked = ev.checked;
                const geoms = chartIns.getAllGeoms();
                for (let i = 0; i < geoms.length; i++) {
                  const geom = geoms[i];
                  if (geom.getYScale().field === value && value === '销售数量同比') {
                    if (checked) {
                      geom.show();
                    } else {
                      geom.hide();
                    }
                  } else if (geom.getYScale().field === 'value' && value !== '销售数量同比') {
                    geom.getShapes().map((shape) => {
                      if (shape._cfg.origin._origin.type == value) {
                        shape._cfg.visible = !shape._cfg.visible;
                      }
                      shape.get('canvas').draw();
                      return shape;
                    });
                  }
                }
              }}
            />
            <Axis name="label" />
            <Axis name="value" position={'left'} />
            <Tooltip />
            <Geom
              type="interval"
              position="label*value"
              color={['type', (value) => {
                if (value === '销售数量') {
                  return '#2b6cbb';
                }
                if (value === '上年销售数量') {
                  return '#41a2fc';
                }
              }]}
              adjust={[{
                type: 'dodge',
                marginRatio: 1 / 32,
              }]}
            />
            <Geom type="line" position="label*销售数量同比" color="#fad248" size={3} />
          </Chart>
        </Card>
        <Card title="销售趋势分析" bordered={false} style={{ width: "100%", marginBottom: "20px" }}>
          <Chart height={400} data={nowCountArr} scale={cols} forceFit>
            <Axis
              name="year"
              title={{
                position: 'end',
                offset: 5,
                textStyle: {
                  fontSize: '12',
                  textAlign: 'center',
                  fill: '#999',
                  fontWeight: 'bold',
                  rotate: 0,
                  autoRotate: true
                }
              }}
            />
            <Axis
              name="value"
              title={{
                position: 'end',
                offset: 5.5,
                textStyle: {
                  fontSize: '12',
                  textAlign: 'right',
                  fill: '#999',
                  fontWeight: 'bold',
                  rotate: 0
                }
              }}
            />
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Geom type="line" position="year*value" size={2}
              tooltip={['year*value', (year, value) => {
                return {
                  name: '数值', // 要显示的名字
                  value: value,
                  title: year
                }
              }]} />
            <Geom
              type="point"
              position="year*value"
              size={4}
              shape={"circle"}
              style={{
                stroke: "#fff",
                lineWidth: 1
              }}
              tooltip={['year*value', (year, value) => {
                return {
                  name: '数值', // 要显示的名字
                  value: value,
                  title: year
                }
              }]}
            />
          </Chart>
        </Card>
      </div>
    );
  }
}

export default BasicProfile;
