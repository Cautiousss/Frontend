import React, { PureComponent } from 'react';
import { Card, Descriptions, Empty, Row, Col, Tabs, Table, Menu, Affix } from 'antd';
import {
    LineChartOutlined,
    PieChartOutlined,
    TableOutlined,
} from '@ant-design/icons';
import jsonp from 'jsonp'; // 接口jsonp实现跨域
import KeyCountries from '@/components/Charts/KeyCountries';

const { Item } = Descriptions;
const { TabPane } = Tabs;
const { Meta } = Card;
const countryKeyMap = {
    "意大利": '1',
    "美国": '2',
    "韩国": '3',
    "伊朗": '4',
    "日本": '5',
    "法国": '6',
    "德国": '7',
    "西班牙": '8'
}
const countryCode = {
    "意大利": 'SCIT0039',
    "美国": 'SCUS0001',
    "韩国": 'SCKR0082',
    "伊朗": 'SCIR0098',
    "日本": 'SCJP0081',
    "法国": 'SCFR0033',
    "德国": 'SCDE0049',
    "西班牙": 'SCES0034'
}
export default class CountryDetails extends PureComponent {
    state = {
        country: "",
        data: {},
        newAddData: {},
        totalData: {},
        nameMapping: {}
    };

    componentDidMount = () => {
        const path = window.location.pathname.split('/');
        const country = decodeURIComponent(path[path.length - 1]);
        const countryKey = countryKeyMap[country];
        this.setState({
            country: countryKey
        });
        this.fetchSinaData(country);
    };

    fetchSinaData = country => {
        const cityCode = countryCode[country];
        if (cityCode) {
            jsonp(`https://gwpre.sina.cn/interface/news/wap/ncp_foreign.d.json?citycode=${cityCode}`, (newErr, newData) => {
                const { city } = newData.data;
                const totalData = city.map(item => ({
                    name: item.name,
                    value: item.conNum
                }));
                this.setState({
                    totalData
                })
                const newAddData = city.map(item => ({
                    name: item.name,
                    value: item.conadd
                }));
                this.setState({
                    newAddData
                });
                const nameMapping = {};
                for (let i = 0; i < city.length; i += 1) {
                    nameMapping[(city[i].mapName).toString()] = city[i].name;
                }
                this.setState({
                    nameMapping
                });
            })
        }
    };

    renderInfo = () => {
        const { data } = this.state;
        if (data === {}) {
            return <Empty />;
        }
        const curDate = new Date();
        curDate.setTime(data.updateTime);
        return (
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card>
                        <Descriptions
                            column={4}
                            colon={false}
                            layout="vertical"
                            style={{ textAlign: 'center' }}
                        >
                            <Item label="现存确诊">
                                <h3 style={{ color: 'red', fontWeight: 'bold', paddingRight: '10px' }}>***</h3>
                            </Item>
                            <Item label="累计确诊">
                                <h3 style={{ color: 'red', fontWeight: 'bold', paddingRight: '10px' }}>***</h3>
                            </Item>
                            <Item label="累计治愈">
                                <h3 style={{ color: 'limegreen', fontWeight: 'bold', paddingRight: '10px' }}>
                                    ***
                </h3>
                            </Item>
                            <Item label="累计死亡">
                                <h3 style={{ color: 'grey', fontWeight: 'bold', paddingRight: '10px' }}>***</h3>
                            </Item>
                        </Descriptions>
                    </Card>
                </Col>
            </Row>
        );
    };

    newAddMap1 = (newAddData, nameMapping) => <KeyCountries data={newAddData} isCurr nameMapping={nameMapping} />;

    sumMap1 = (totalData, nameMapping) => <KeyCountries data={totalData} isCurr={false} nameMapping={nameMapping} />;

    renderMap1 = () => {
        const { newAddData, totalData, nameMapping } = this.state;
        return (
            <Card>
                <Meta title="国家地图" avatar={<PieChartOutlined />} />
                <p />
                <Tabs defaultActiveKey="1" onChange={this.callback()}>
                    <TabPane tab="新增" key="1">
                        {this.newAddMap1(newAddData, nameMapping)}
                    </TabPane>
                    <TabPane tab="累计" key="2">
                        {this.sumMap1(totalData, nameMapping)}
                    </TabPane>
                </Tabs>
            </Card>
        );
    };

    callback = () => {
    };

    renderMap2 = () => {
        return (
            <Card>
                <Meta title="国家曲线" avatar={<LineChartOutlined />} />
                <p />
                <Tabs defaultActiveKey="1" onChange={this.callback()}>
                    <TabPane tab="累计确诊" key="1">
                        Content of Tab Pane 1
          </TabPane>
                    <TabPane tab="新增确诊" key="2">
                        Content of Tab Pane 2
          </TabPane>
                    <TabPane tab="新增死亡" key="3">
                        Content of Tab Pane 3
          </TabPane>
                    <TabPane tab="新增治愈" key="4">
                        Content of Tab Pane 4
          </TabPane>
                </Tabs>
            </Card>
        );
    };

    renderTable = () => {
        return (
            <Card>
                <Meta title="数据列表" avatar={<TableOutlined />} />
                <p />
                <Table />
            </Card>
        );
    };

    renderCureDeath = () => { };

    renderSider = () => {
        const key = this.state.country;
        return (
            <Affix offsetTop={90}>
                <Menu
                    style={{ width: 256, height: 700 }}
                    selectedKeys={key}
                    mode="inline"
                >
                    <Menu.Item key="0">
                        <a href="/world">
                            <span role="img" aria-label="世界">
                                🌍 世界
          </span>
                        </a>
                    </Menu.Item>
                    <Menu.Item key="1">
                        <a href="/world/details/意大利">
                            <span role="img" aria-label="意大利">
                                🇮🇹 意大利
          </span>
                        </a>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <a href="/world/details/美国">
                            <span role="img" aria-label="美国">
                                🇺🇸 美国
          </span>
                        </a>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <a href="/world/details/韩国">
                            <span role="img" aria-label="韩国">
                                🇰🇷 韩国
          </span>
                        </a>
                    </Menu.Item>
                    <Menu.Item key="4">
                        <a href="/world/details/伊朗">
                            <span role="img" aria-label="伊朗">
                                🇮🇷 伊朗
          </span>
                        </a>
                    </Menu.Item>
                    <Menu.Item key="5">
                        <a href="/world/details/日本">
                            <span role="img" aria-label="日本">
                                🇯🇵 日本
          </span>
                        </a>
                    </Menu.Item>
                    <Menu.Item key="6">
                        <a href="/world/details/法国">
                            <span role="img" aria-label="法国">
                                🇫🇷 法国
          </span>
                        </a>
                    </Menu.Item>
                    <Menu.Item key="7">
                        <a href="/world/details/德国">
                            <span role="img" aria-label="德国">
                                🇩🇪 德国
          </span>
                        </a>
                    </Menu.Item>
                    <Menu.Item key="8">
                        <a href="/world/details/西班牙">
                            <span role="img" aria-label="西班牙">
                                🇪🇸 西班牙
          </span>
                        </a>
                    </Menu.Item>
                </Menu>
            </Affix>
        );
    };

    render() {
        return (
            <div>
                <Row gutter={[16, 16]}>
                    <Col span={4}>{this.renderSider()}</Col>
                    <Col span={19} offset={1}>
                        {this.renderInfo()}
                    </Col>
                    <Col span={19} offset={1}>
                        {this.renderMap1()}
                    </Col>
                    <Col span={19} offset={1}>
                        {this.renderMap2()}
                    </Col>
                    <Col span={19} offset={5}>
                        {this.renderTable()}
                    </Col>
                </Row>
            </div>
        );
    }
}
