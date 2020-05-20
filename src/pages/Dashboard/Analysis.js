import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Icon,
  Card,
  Tabs,
  DatePicker,
  List, message, Avatar, Spin, Empty
} from 'antd';
import {
  ChartCard,
  Bar,
  Pie,
  TimelineChart,
} from '@/components/Charts';
import InfiniteScroll from 'react-infinite-scroller';
import NumberInfo from '@/components/NumberInfo';
import numeral from 'numeral';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Yuan from '@/utils/Yuan';
import { getTimeDistance } from '@/utils/utils';

import styles from './Analysis.less';
import { API } from '@/api/index'
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// const rankingListData = [];
// for (let i = 0; i < 7; i += 1) {
//   rankingListData.push({
//     title: `工专路 ${i} 号店`,
//     total: 323234,
//   });
// }

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class Analysis extends Component {
  // constructor(props) {
  //   super(props);
  //   this.rankingListData = [];
  //   for (let i = 0; i < 7; i += 1) {
  //     this.rankingListData.push({
  //       title: formatMessage({ id: 'app.analysis.test' }, { no: i }),
  //       total: 323234,
  //     });
  //   }
  // }

  state = {
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
    loading: true,
    newSaleTypeData: [],
    totalCount: 0,
    totalProfit: 0,

    // lastYearCount: 0
    eachMonthCount: [],
    eachMonthProfit: 0,
    rankingListData: [],
    rankData: [],
    loading1: false,
    hasMore: true,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'chart/fetch',
      });
      this.timeoutId = setTimeout(() => {
        this.setState({
          loading: false,
        });
      }, 600);
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
      "xValue": "month",
      "yValue": "sale-profit",
    }).then(res => {
      let totalProfit = [];
      let rankingListData = [];
      res.data.forEach(item => {
        totalProfit = + item.value;
        rankingListData.push({
          title: item.key,
          total: item.value
        })
      })
      console.log("elat", rankingListData)
      this.setState({
        totalProfit,
        rankingListData
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
      "xValue": "month",
      "yValue": "sale-profit",
    }).then(res => {
      let eachMonthProfit = [];
      for (let i = 0; i < 12; i += 1) {
        eachMonthProfit.push({
          x: `${i + 1}月`,
          y: res.data[i].value
        });
      }
      // res.data.forEach((item, index) => {
      //   eachMonthCount.push({
      //     x:`${i + 1}月`,
      //     y: res.data[i].value
      //   })
      // });
      console.log("lat", eachMonthProfit)
      this.setState({
        eachMonthProfit
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
      "xValue": "month",
      "yValue": "sale-amount",
    }).then(res => {
      let eachMonthCount = [];
      for (let i = 0; i < 12; i += 1) {
        eachMonthCount.push({
          x: `${i + 1}月`,
          y: res.data[i].value
        });
      }
      // res.data.forEach((item, index) => {
      //   eachMonthCount.push({
      //     x:`${i + 1}月`,
      //     y: res.data[i].value
      //   })
      // });
      console.log("late", eachMonthCount)
      this.setState({
        eachMonthCount
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
      "xType": "location",
      "xValue": "area",
      "yValue": "sale-amount",
    }).then(res => {
      let newSaleTypeData = [];
      let totalCount = 0;
      res.data.forEach(item => {
        totalCount = + item.value;
        newSaleTypeData.push({
          x: item.key,
          y: item.value
        })
      })
      this.setState({
        newSaleTypeData,
        totalCount
      })
    })
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);

  }

  handleInfiniteOnLoad = () => {
    let { rankingListData } = this.state;
    // this.setState({
    //   loading: true,
    // });
    if (rankingListData.length > 14) {
      message.warning('Infinite List loaded all');
      this.setState({
        // eslint-disable-next-line react/no-unused-state
        hasMore: false,
        loading: false,
      });

    }

  };


  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };

  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  }

  render() {
    const { loading1, hasMore, loading: stateLoading, currentTabKey, newSaleTypeData, totalCount, eachMonthCount, eachMonthProfit, totalProfit, rankingListData } = this.state;
    const { chart, loading: propsLoading } = this.props;
    const {
      // salesData,
      offlineData,
      offlineChartData,
    } = chart;
    const loading = propsLoading || stateLoading;
    console.log("eachMonthCount", eachMonthCount)
    // const salesExtra = (
    //   <div className={styles.salesExtraWrap}>
    //     <div className={styles.salesExtra}>
    //       <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
    //         <FormattedMessage id="app.analysis.all-day" defaultMessage="All Day" />
    //       </a>
    //       <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
    //         <FormattedMessage id="app.analysis.all-week" defaultMessage="All Week" />
    //       </a>
    //       <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
    //         <FormattedMessage id="app.analysis.all-month" defaultMessage="All Month" />
    //       </a>
    //       <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
    //         <FormattedMessage id="app.analysis.all-year" defaultMessage="All Year" />
    //       </a>
    //     </div>
    //     <RangePicker
    //       value={rangePickerValue}
    //       onChange={this.handleRangePickerChange}
    //       style={{ width: 256 }}
    //     />
    //   </div>
    // );

    // const columns = [
    //   {
    //     title: <FormattedMessage id="app.analysis.table.rank" defaultMessage="Rank" />,
    //     dataIndex: 'index',
    //     key: 'index',
    //   },
    //   {
    //     title: (
    //       <FormattedMessage
    //         id="app.analysis.table.search-keyword"
    //         defaultMessage="Search keyword"
    //       />
    //     ),
    //     dataIndex: 'keyword',
    //     key: 'keyword',
    //     render: text => <a href="/">{text}</a>,
    //   },
    //   {
    //     title: <FormattedMessage id="app.analysis.table.users" defaultMessage="Users" />,
    //     dataIndex: 'count',
    //     key: 'count',
    //     sorter: (a, b) => a.count - b.count,
    //     className: styles.alignRight,
    //   },
    //   {
    //     title: (
    //       <FormattedMessage id="app.analysis.table.weekly-range" defaultMessage="Weekly Range" />
    //     ),
    //     dataIndex: 'range',
    //     key: 'range',
    //     sorter: (a, b) => a.range - b.range,
    //     render: (text, record) => (
    //       <Trend flag={record.status === 1 ? 'down' : 'up'}>
    //         <span style={{ marginRight: 4 }}>{text}%</span>
    //       </Trend>
    //     ),
    //     align: 'right',
    //   },
    // ];

    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);

    const CustomTab = ({ data, currentTabKey: currentKey }) => (
      <Row gutter={8} style={{ width: 138, margin: '8px 0' }}>
        <Col span={12}>
          <NumberInfo
            title={data.name}
            subTitle={
              <FormattedMessage
                id="app.analysis.conversion-rate"
                defaultMessage="Conversion Rate"
              />
            }
            gap={2}
            total={`${data.cvr * 100}%`}
            theme={currentKey !== data.name && 'light'}
          />
        </Col>
        <Col span={12} style={{ paddingTop: 36 }}>
          <Pie
            animate={false}
            color={currentKey !== data.name && '#BDE4FF'}
            inner={0.55}
            tooltip={false}
            margin={[0, 0, 0, 0]}
            percent={data.cvr * 100}
            height={64}
          />
        </Col>
      </Row>
    );

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
    };

    return (
      <GridContent>
        <Row gutter={24}>
          <Col span={12}>
            <ChartCard
              bordered={false}
              title={
                <FormattedMessage id="app.analysis.total-sales" defaultMessage="Total Sales" />
              }
              action={
                <Icon type="info-circle-o" />
              }
              loading={loading}
              total={() => <Yuan>{totalCount}</Yuan>}

              contentHeight={46}
            >

            </ChartCard>
          </Col>
          <Col span={12} style={{ marginBottom: "20px" }}>
            <ChartCard
              bordered={false}
              title={
                <FormattedMessage id="app.analysis.total-profit" defaultMessage="Total Sales" />
              }
              action={
                <Icon type="info-circle-o" />
              }
              loading={loading}
              total={() => <Yuan>{totalProfit}</Yuan>}

              contentHeight={46}
            >

            </ChartCard>
          </Col>

        </Row>

        <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.salesCard}>
            <Tabs>
              <TabPane
                tab={<FormattedMessage id="app.analysis.month-sales" defaultMessage="月销售额总览" />}
                key="sales"
              >
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Bar
                        height={295}
                        title={
                          <FormattedMessage
                            id="app.analysis.sales-trend"
                            defaultMessage="Sales Trend"
                          />
                        }
                        data={eachMonthCount}
                      />
                    </div>
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesRank}>
                      <h4 className={styles.rankingTitle}>
                        <FormattedMessage
                          id="app.analysis.month-count-rank"
                          defaultMessage="Sales Ranking"
                        />
                      </h4>
                      <div className="demo-infinite-container" style={{ height: "300px", overflow: 'auto' }}>
                        <InfiniteScroll
                          initialLoad={false}
                          pageStart={0}
                          loadMore={this.handleInfiniteOnLoad}
                          hasMore
                          useWindow={false}
                        >
                          <List
                            dataSource={eachMonthCount.sort((a, b) => a.y - b.y)}
                            renderItem={(item, i) => (
                              <List.Item key={item.id}>
                                <List.Item.Meta
                                  avatar={
                                    <span
                                      className={`${styles.rankingItemNumber} ${
                                        i < 3 ? styles.active : ''
                                        }`}
                                    >
                                      {i + 1}
                                    </span>
                                  }
                                  title={<a>{item.x}</a>}
                                />
                                <div>{item.y}</div>
                              </List.Item>
                            )}
                          >
                            {loading1 && hasMore && (
                              <div className="demo-loading-container">
                                <Spin />
                              </div>
                            )}
                          </List>
                        </InfiniteScroll>
                      </div>
                      {/* 
                          <ul className={styles.rankingList}>
                        {rankingListData.sort((a, b) => a.total - b.total).map((item, i) => (
                          <li key={item.title}>
                            <span
                              className={`${styles.rankingItemNumber} ${
                                i < 3 ? styles.active : ''
                                }`}
                            >
                              {i + 1}
                            </span>
                            <span className={styles.rankingItemTitle} title={item.title}>
                              {item.title}
                            </span>
                            <span className={styles.rankingItemValue}>
                              {numeral(item.total).format('0,0')}
                            </span>
                          </li>
                        ))}
                      </ul>
                    */}

                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane
                tab={<FormattedMessage id="app.analysis.month-visits" defaultMessage="Visits" />}
                key="views"
              >
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Bar
                        height={292}
                        title={
                          <FormattedMessage
                            id="app.analysis.visits-trend"
                            defaultMessage="Visits Trend"
                          />
                        }
                        data={eachMonthProfit}
                      />
                    </div>
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesRank}>
                      <h4 className={styles.rankingTitle}>
                        <FormattedMessage
                          id="app.analysis.month-profit-rank"
                          defaultMessage="Visits Ranking"
                        />
                      </h4>
                      <div className="demo-infinite-container" style={{ height: "300px", overflow: 'auto' }}>
                        <InfiniteScroll
                          initialLoad={false}
                          pageStart={0}
                          loadMore={this.handleInfiniteOnLoad}
                          hasMore={!loading1 && hasMore}
                          useWindow={false}
                        >
                          <List
                            dataSource={rankingListData.sort((a, b) => a.total - b.total)}
                            renderItem={(item, i) => (
                              <List.Item key={item.id}>
                                <List.Item.Meta
                                  avatar={
                                    <span
                                      className={`${styles.rankingItemNumber} ${
                                        i < 3 ? styles.active : ''
                                        }`}
                                    >
                                      {i + 1}
                                    </span>
                                  }
                                  title={<a>{item.title}</a>}
                                />
                                <div style={{ marginRight: "10px" }}>{item.total}</div>
                              </List.Item>
                            )}
                          >
                            {loading1 && hasMore && (
                              <div className="demo-loading-container">
                                <Spin />
                              </div>
                            )}
                          </List>
                        </InfiniteScroll>
                      </div>
                    </div>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </div>
        </Card>

        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card
              loading={loading}
              className={styles.salesCard}
              bordered={false}
              title={
                <FormattedMessage
                  id="区域对比"
                  defaultMessage="区域对比"
                />
              }
              bodyStyle={{ padding: 24 }}

              style={{ marginTop: 24, minHeight: 509 }}
            >
              <h4 style={{ marginTop: 8, marginBottom: 32 }}>
                <FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />
              </h4>
              <Pie
                hasLegend
                subTitle={<FormattedMessage id="app.analysis.sales" defaultMessage="区域对比环图" />}
                total={() => <Yuan>{newSaleTypeData.reduce((pre, now) => now.y + pre, 0)}</Yuan>}
                data={newSaleTypeData}
                valueFormat={value => <Yuan>{value}</Yuan>}
                height={248}
                lineWidth={4}
              />
            </Card>

          </Col>
        </Row>



        {/*
          <Card
          loading={loading}
          className={styles.offlineCard}
          bordered={false}
          bodyStyle={{ padding: '0 0 32px 0' }}
          style={{ marginTop: 32 }}
        >
          <Tabs activeKey={activeKey} onChange={this.handleTabChange}>
            {offlineData.map(shop => (
              <TabPane tab={<CustomTab data={shop} currentTabKey={activeKey} />} key={shop.name}>
                <div style={{ padding: '0 24px' }}>
                  <TimelineChart
                    height={400}
                    data={offlineChartData}
                    titleMap={{
                      y1: formatMessage({ id: 'app.analysis.traffic' }),
                      y2: formatMessage({ id: 'app.analysis.payments' }),
                    }}
                  />
                </div>
              </TabPane>
            ))}
          </Tabs>
        </Card>
         */}

      </GridContent>
    );
  }
}

export default Analysis;
