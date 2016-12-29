/**
 * @author DuYing
 * @homepage https://github.com/Dale-/
 * @since 12/23/16
 */

export const INPUT = [
	// '310000,310100,310101',
	// '310000,310100,310104',
	// '310000,310100,310105',
	// '310000,310100,310106',
	// '310000,310100,310107',
	// '310000,310100,310108',
	// '110000',
	'320000,320100',
	'320000,321300',
	'320000,321200,321281'
];

export const COMMON_AREAS = ['江浙沪', '珠三角', '京津翼', '东三省', '港澳台', '江浙沪皖'];

export const AREAS =
	[
		{
			'id': '310000',
			'name': '上海',
			'children': [
				{
					'id': '310100',
					'name': '上海市',
					'children': [
						{'id': '310101', 'name': '黄浦区', 'children': null},
						{'id': '310104', 'name': '徐汇区', 'children': null},
						{'id': '310105', 'name': '长宁区', 'children': null},
						{'id': '310106', 'name': '静安区', 'children': null},
						{'id': '310107', 'name': '普陀区', 'children': null},
						{'id': '310108', 'name': '闸北区', 'children': null},
						{'id': '310109', 'name': '虹口区', 'children': null},
						{'id': '310110', 'name': '杨浦区', 'children': null},
						{'id': '310112', 'name': '闵行区', 'children': null},
						{'id': '310113', 'name': '宝山区', 'children': null},
						{'id': '310114', 'name': '嘉定区', 'children': null},
						{'id': '310115', 'name': '浦东新区', 'children': null},
						{'id': '310116', 'name': '金山区', 'children': null},
						{'id': '310117', 'name': '松江区', 'children': null},
						{'id': '310118', 'name': '青浦区', 'children': null},
						{'id': '310120', 'name': '奉贤区', 'children': null}]
				},
				{
					'id': '310200',
					'name': '县',
					'children': [
						{'id': '310230', 'name': '崇明县', 'children': null}]
				}
			]
		},
		{
			'id': '110000',
			'name': '北京',
			'children': [
				{
					'id': '110100',
					'name': '市辖区',
					'children': [
						{'id': '110101', 'name': '东城区', 'children': null},
						{'id': '110102', 'name': '西城区', 'children': null},
						{'id': '110103', 'name': '崇文区', 'children': null},
						{'id': '110104', 'name': '宣武区', 'children': null},
						{'id': '110105', 'name': '朝阳区', 'children': null},
						{'id': '110106', 'name': '丰台区', 'children': null},
						{'id': '110107', 'name': '石景山区', 'children': null},
						{'id': '110108', 'name': '海淀区', 'children': null},
						{'id': '110109', 'name': '门头沟区', 'children': null},
						{'id': '110111', 'name': '房山区', 'children': null},
						{'id': '110112', 'name': '通州区', 'children': null},
						{'id': '110113', 'name': '顺义区', 'children': null},
						{'id': '110114', 'name': '昌平区', 'children': null},
						{'id': '110115', 'name': '大兴区', 'children': null},
						{'id': '110116', 'name': '怀柔区', 'children': null},
						{'id': '110117', 'name': '平谷区', 'children': null}]
				},
				{
					'id': '110200',
					'name': '县',
					'children': [
						{'id': '110228', 'name': '密云县', 'children': null},
						{'id': '110229', 'name': '延庆县', 'children': null}]
				}
			]
		},
		{
			'id': '320000',
			'name': '江苏',
			'children': [
				{
					'id': '320100',
					'name': '南京市',
					'children': [
						{'id': '320101', 'name': '市辖区', 'children': null},
						{'id': '320102', 'name': '玄武区', 'children': null},
						{'id': '320103', 'name': '白下区', 'children': null},
						{'id': '320104', 'name': '秦淮区', 'children': null},
						{'id': '320105', 'name': '建邺区', 'children': null},
						{'id': '320106', 'name': '鼓楼区', 'children': null},
						{'id': '320107', 'name': '下关区', 'children': null},
						{'id': '320111', 'name': '浦口区', 'children': null},
						{'id': '320113', 'name': '栖霞区', 'children': null},
						{'id': '320114', 'name': '雨花台区', 'children': null},
						{'id': '320115', 'name': '江宁区', 'children': null},
						{'id': '320116', 'name': '六合区', 'children': null},
						{'id': '320124', 'name': '溧水县', 'children': null},
						{'id': '320125', 'name': '高淳县', 'children': null}
					]
				},
				{
					'id': '320200',
					'name': '无锡市',
					'children': [
						{'id': '320201', 'name': '市辖区', 'children': null},
						{'id': '320202', 'name': '崇安区', 'children': null},
						{'id': '320203', 'name': '南长区', 'children': null},
						{'id': '320204', 'name': '北塘区', 'children': null},
						{'id': '320205', 'name': '锡山区', 'children': null},
						{'id': '320206', 'name': '惠山区', 'children': null},
						{'id': '320211', 'name': '滨湖区', 'children': null},
						{'id': '320281', 'name': '江阴市', 'children': null},
						{'id': '320282', 'name': '宜兴市', 'children': null}
					]
				},
				{
					'id': '320300',
					'name': '徐州市',
					'children': [
						{'id': '320301', 'name': '市辖区', 'children': null},
						{'id': '320302', 'name': '鼓楼区', 'children': null},
						{'id': '320303', 'name': '云龙区', 'children': null},
						{'id': '320305', 'name': '贾汪区', 'children': null},
						{'id': '320311', 'name': '泉山区', 'children': null},
						{'id': '320312', 'name': '铜山区', 'children': null},
						{'id': '320321', 'name': '丰县', 'children': null},
						{'id': '320322', 'name': '沛县', 'children': null},
						{'id': '320324', 'name': '睢宁县', 'children': null},
						{'id': '320381', 'name': '新沂市', 'children': null},
						{'id': '320382', 'name': '邳州市', 'children': null}
					]
				},
				{
					'id': '320400',
					'name': '常州市',
					'children': [
						{'id': '320401', 'name': '市辖区', 'children': null},
						{'id': '320402', 'name': '天宁区', 'children': null},
						{'id': '320404', 'name': '钟楼区', 'children': null},
						{'id': '320405', 'name': '戚墅堰区', 'children': null},
						{'id': '320411', 'name': '新北区', 'children': null},
						{'id': '320412', 'name': '武进区', 'children': null},
						{'id': '320481', 'name': '溧阳市', 'children': null},
						{'id': '320482', 'name': '金坛市', 'children': null}
					]
				},
				{
					'id': '320500',
					'name': '苏州市',
					'children': [
						{'id': '320501', 'name': '市辖区', 'children': null},
						{'id': '320502', 'name': '沧浪区', 'children': null},
						{'id': '320503', 'name': '平江区', 'children': null},
						{'id': '320504', 'name': '金阊区', 'children': null},
						{'id': '320505', 'name': '虎丘区', 'children': null},
						{'id': '320506', 'name': '吴中区', 'children': null},
						{'id': '320507', 'name': '相城区', 'children': null},
						{'id': '320581', 'name': '常熟市', 'children': null},
						{'id': '320582', 'name': '张家港市', 'children': null},
						{'id': '320583', 'name': '昆山市', 'children': null},
						{'id': '320584', 'name': '吴江市', 'children': null},
						{'id': '320585', 'name': '太仓市', 'children': null}
					]
				},
				{
					'id': '320600',
					'name': '南通市',
					'children': [
						{'id': '320601', 'name': '市辖区', 'children': null},
						{'id': '320602', 'name': '崇川区', 'children': null},
						{'id': '320611', 'name': '港闸区', 'children': null},
						{'id': '320612', 'name': '通州区', 'children': null},
						{'id': '320621', 'name': '海安县', 'children': null},
						{'id': '320623', 'name': '如东县', 'children': null},
						{'id': '320681', 'name': '启东市', 'children': null},
						{'id': '320682', 'name': '如皋市', 'children': null},
						{'id': '320684', 'name': '海门市', 'children': null}
					]
				},
				{
					'id': '320700',
					'name': '连云港市',
					'children': [
						{'id': '320701', 'name': '市辖区', 'children': null},
						{'id': '320703', 'name': '连云区', 'children': null},
						{'id': '320705', 'name': '新浦区', 'children': null},
						{'id': '320706', 'name': '海州区', 'children': null},
						{'id': '320721', 'name': '赣榆县', 'children': null},
						{'id': '320722', 'name': '东海县', 'children': null},
						{'id': '320723', 'name': '灌云县', 'children': null},
						{'id': '320724', 'name': '灌南县', 'children': null}
					]
				},
				{
					'id': '320800',
					'name': '淮安市',
					'children': [
						{'id': '320801', 'name': '市辖区', 'children': null},
						{'id': '320802', 'name': '清河区', 'children': null},
						{'id': '320803', 'name': '楚州区', 'children': null},
						{'id': '320804', 'name': '淮阴区', 'children': null},
						{'id': '320811', 'name': '清浦区', 'children': null},
						{'id': '320826', 'name': '涟水县', 'children': null},
						{'id': '320829', 'name': '洪泽县', 'children': null},
						{'id': '320830', 'name': '盱眙县', 'children': null},
						{'id': '320831', 'name': '金湖县', 'children': null}
					]
				},
				{
					'id': '320900',
					'name': '盐城市',
					'children': [
						{'id': '320901', 'name': '市辖区', 'children': null},
						{'id': '320902', 'name': '亭湖区', 'children': null},
						{'id': '320903', 'name': '盐都区', 'children': null},
						{'id': '320921', 'name': '响水县', 'children': null},
						{'id': '320922', 'name': '滨海县', 'children': null},
						{'id': '320923', 'name': '阜宁县', 'children': null},
						{'id': '320924', 'name': '射阳县', 'children': null},
						{'id': '320925', 'name': '建湖县', 'children': null},
						{'id': '320981', 'name': '东台市', 'children': null},
						{'id': '320982', 'name': '大丰市', 'children': null}
					]
				},
				{
					'id': '321000',
					'name': '扬州市',
					'children': [
						{'id': '321001', 'name': '市辖区', 'children': null},
						{'id': '321002', 'name': '广陵区', 'children': null},
						{'id': '321003', 'name': '邗江区', 'children': null},
						{'id': '321012', 'name': '江都区', 'children': null},
						{'id': '321023', 'name': '宝应县', 'children': null},
						{'id': '321081', 'name': '仪征市', 'children': null},
						{'id': '321084', 'name': '高邮市', 'children': null}
					]
				},
				{
					'id': '321100',
					'name': '镇江市',
					'children': [
						{'id': '321101', 'name': '市辖区', 'children': null},
						{'id': '321102', 'name': '京口区', 'children': null},
						{'id': '321111', 'name': '润州区', 'children': null},
						{'id': '321112', 'name': '丹徒区', 'children': null},
						{'id': '321181', 'name': '丹阳市', 'children': null},
						{'id': '321182', 'name': '扬中市', 'children': null},
						{'id': '321183', 'name': '句容市', 'children': null}
					]
				},
				{
					'id': '321200',
					'name': '泰州市',
					'children': [
						{'id': '321201', 'name': '市辖区', 'children': null},
						{'id': '321202', 'name': '海陵区', 'children': null},
						{'id': '321203', 'name': '高港区', 'children': null},
						{'id': '321281', 'name': '兴化市', 'children': null},
						{'id': '321282', 'name': '靖江市', 'children': null},
						{'id': '321283', 'name': '泰兴市', 'children': null},
						{'id': '321284', 'name': '姜堰市', 'children': null}
					]
				},
				{
					'id': '321300',
					'name': '宿迁市',
					'children': [
						{'id': '321301', 'name': '市辖区', 'children': null},
						{'id': '321302', 'name': '宿城区', 'children': null},
						{'id': '321311', 'name': '宿豫区', 'children': null},
						{'id': '321322', 'name': '沭阳县', 'children': null},
						{'id': '321323', 'name': '泗阳县', 'children': null},
						{'id': '321324', 'name': '泗洪县', 'children': null}
					]
				}
			]
		}
	];
