/**
 * @author DuYing
 * @homepage https://github.com/Dale-/
 * @since 12/23/16
 */

export const INPUT = [
	'310000,310100,310101',
	'310000,310100,310104',
	'310000,310100,310105',
	'310000,310100,310106',
	'310000,310100,310107',
	'310000,310100,310108',
	'320000,320100',
	'320000,321300',
	'320000,321200,321281'
];

export const COMMON_AREAS =
	[
		{
			'id': 1,
			'name': '江浙沪',
			'children': ['310000', '320000']
		},
		{
			'id': 2,
			'name': '珠三角',
			'children': []
		},
		{
			'id': 3,
			'name': '京津翼',
			'children': ['110000']
		},
		{
			'id': 4,
			'name': '东三省',
			'children': ['210000']
		},
		{
			'id': 5,
			'name': '港澳台',
			'children': ['710000', '810000', '820000']
		}
	];

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
		},
		{
			'id': '210000',
			'name': '辽宁省',
			'children': [
				{
					'id': '210100',
					'name': '沈阳市',
					'children': [
						{'id': '210101', 'name': '市辖区', 'children': null},
						{'id': '210102', 'name': '和平区', 'children': null},
						{'id': '210103', 'name': '沈河区', 'children': null},
						{'id': '210104', 'name': '大东区', 'children': null},
						{'id': '210105', 'name': '皇姑区', 'children': null},
						{'id': '210106', 'name': '铁西区', 'children': null},
						{'id': '210111', 'name': '苏家屯区', 'children': null},
						{'id': '210112', 'name': '东陵区', 'children': null},
						{'id': '210113', 'name': '新城子区', 'children': null},
						{'id': '210114', 'name': '于洪区', 'children': null},
						{'id': '210122', 'name': '辽中县', 'children': null},
						{'id': '210123', 'name': '康平县', 'children': null},
						{'id': '210124', 'name': '法库县', 'children': null},
						{'id': '210181', 'name': '新民市', 'children': null}
					]
				},
				{
					'id': '210200',
					'name': '大连市',
					'children': [
						{'id': '210201', 'name': '市辖区', 'children': null},
						{'id': '210202', 'name': '中山区', 'children': null},
						{'id': '210203', 'name': '西岗区', 'children': null},
						{'id': '210204', 'name': '沙河口区', 'children': null},
						{'id': '210211', 'name': '甘井子区', 'children': null},
						{'id': '210212', 'name': '旅顺口区', 'children': null},
						{'id': '210213', 'name': '金州区', 'children': null},
						{'id': '210224', 'name': '长海县', 'children': null},
						{'id': '210281', 'name': '瓦房店市', 'children': null},
						{'id': '210282', 'name': '普兰店市', 'children': null},
						{'id': '210283', 'name': '庄河市', 'children': null}
					]
				},
				{
					'id': '210300',
					'name': '鞍山市',
					'children': [
						{'id': '210301', 'name': '市辖区', 'children': null},
						{'id': '210302', 'name': '铁东区', 'children': null},
						{'id': '210303', 'name': '铁西区', 'children': null},
						{'id': '210304', 'name': '立山区', 'children': null},
						{'id': '210311', 'name': '千山区', 'children': null},
						{'id': '210321', 'name': '台安县', 'children': null},
						{'id': '210323', 'name': '岫岩满族自治县', 'children': null},
						{'id': '210381', 'name': '海城市', 'children': null}
					]
				},
				{
					'id': '210400',
					'name': '抚顺市',
					'children': [
						{'id': '210401', 'name': '市辖区', 'children': null},
						{'id': '210402', 'name': '新抚区', 'children': null},
						{'id': '210403', 'name': '东洲区', 'children': null},
						{'id': '210404', 'name': '望花区', 'children': null},
						{'id': '210411', 'name': '顺城区', 'children': null},
						{'id': '210421', 'name': '抚顺县', 'children': null},
						{'id': '210422', 'name': '新宾满族自治县', 'children': null},
						{'id': '210423', 'name': '清原满族自治县', 'children': null}
					]
				},
				{
					'id': '210500',
					'name': '本溪市',
					'children': [
						{'id': '210501', 'name': '市辖区', 'children': null},
						{'id': '210502', 'name': '平山区', 'children': null},
						{'id': '210503', 'name': '溪湖区', 'children': null},
						{'id': '210504', 'name': '明山区', 'children': null},
						{'id': '210505', 'name': '南芬区', 'children': null},
						{'id': '210521', 'name': '本溪满族自治县', 'children': null},
						{'id': '210522', 'name': '桓仁满族自治县', 'children': null}
					]
				},
				{
					'id': '210600',
					'name': '丹东市',
					'children': [
						{'id': '210601', 'name': '市辖区', 'children': null},
						{'id': '210602', 'name': '元宝区', 'children': null},
						{'id': '210603', 'name': '振兴区', 'children': null},
						{'id': '210604', 'name': '振安区', 'children': null},
						{'id': '210624', 'name': '宽甸满族自治县', 'children': null},
						{'id': '210681', 'name': '东港市', 'children': null},
						{'id': '210682', 'name': '凤城市', 'children': null}
					]
				},
				{
					'id': '210700',
					'name': '锦州市',
					'children': [
						{'id': '210701', 'name': '市辖区', 'children': null},
						{'id': '210702', 'name': '古塔区', 'children': null},
						{'id': '210703', 'name': '凌河区', 'children': null},
						{'id': '210711', 'name': '太和区', 'children': null},
						{'id': '210726', 'name': '黑山县', 'children': null},
						{'id': '210727', 'name': '义　县', 'children': null},
						{'id': '210781', 'name': '凌海市', 'children': null},
						{'id': '210782', 'name': '北宁市', 'children': null}
					]
				},
				{
					'id': '210800',
					'name': '营口市',
					'children': [
						{'id': '210801', 'name': '市辖区', 'children': null},
						{'id': '210802', 'name': '站前区', 'children': null},
						{'id': '210803', 'name': '西市区', 'children': null},
						{'id': '210804', 'name': '鲅鱼圈区', 'children': null},
						{'id': '210811', 'name': '老边区', 'children': null},
						{'id': '210881', 'name': '盖州市', 'children': null},
						{'id': '210882', 'name': '大石桥市', 'children': null}
					]
				},
				{
					'id': '210900',
					'name': '阜新市',
					'children': [
						{'id': '210901', 'name': '市辖区', 'children': null},
						{'id': '210902', 'name': '海州区', 'children': null},
						{'id': '210903', 'name': '新邱区', 'children': null},
						{'id': '210904', 'name': '太平区', 'children': null},
						{'id': '210905', 'name': '清河门区', 'children': null},
						{'id': '210911', 'name': '细河区', 'children': null},
						{'id': '210921', 'name': '阜新蒙古族自治县', 'children': null},
						{'id': '210922', 'name': '彰武县', 'children': null}
					]
				},
				{
					'id': '211000',
					'name': '辽阳市',
					'children': [
						{'id': '211001', 'name': '市辖区', 'children': null},
						{'id': '211002', 'name': '白塔区', 'children': null},
						{'id': '211003', 'name': '文圣区', 'children': null},
						{'id': '211004', 'name': '宏伟区', 'children': null},
						{'id': '211005', 'name': '弓长岭区', 'children': null},
						{'id': '211011', 'name': '太子河区', 'children': null},
						{'id': '211021', 'name': '辽阳县', 'children': null},
						{'id': '211081', 'name': '灯塔市', 'children': null}
					]
				},
				{
					'id': '211100',
					'name': '盘锦市',
					'children': [
						{'id': '211101', 'name': '市辖区', 'children': null},
						{'id': '211102', 'name': '双台子区', 'children': null},
						{'id': '211103', 'name': '兴隆台区', 'children': null},
						{'id': '211121', 'name': '大洼县', 'children': null},
						{'id': '211122', 'name': '盘山县', 'children': null}
					]
				},
				{
					'id': '211200',
					'name': '铁岭市',
					'children': [
						{'id': '211201', 'name': '市辖区', 'children': null},
						{'id': '211202', 'name': '银州区', 'children': null},
						{'id': '211204', 'name': '清河区', 'children': null},
						{'id': '211221', 'name': '铁岭县', 'children': null},
						{'id': '211223', 'name': '西丰县', 'children': null},
						{'id': '211224', 'name': '昌图县', 'children': null},
						{'id': '211281', 'name': '调兵山市', 'children': null},
						{'id': '211282', 'name': '开原市', 'children': null}
					]
				},
				{
					'id': '211300',
					'name': '朝阳市',
					'children': [
						{'id': '211301', 'name': '市辖区', 'children': null},
						{'id': '211302', 'name': '双塔区', 'children': null},
						{'id': '211303', 'name': '龙城区', 'children': null},
						{'id': '211321', 'name': '朝阳县', 'children': null},
						{'id': '211322', 'name': '建平县', 'children': null},
						{'id': '211324', 'name': '喀喇沁左翼蒙古族自治县', 'children': null},
						{'id': '211381', 'name': '北票市', 'children': null},
						{'id': '211382', 'name': '凌源市', 'children': null}
					]
				},
				{
					'id': '211400',
					'name': '葫芦岛市',
					'children': [
						{'id': '211401', 'name': '市辖区', 'children': null},
						{'id': '211402', 'name': '连山区', 'children': null},
						{'id': '211403', 'name': '龙港区', 'children': null},
						{'id': '211404', 'name': '南票区', 'children': null},
						{'id': '211421', 'name': '绥中县', 'children': null},
						{'id': '211422', 'name': '建昌县', 'children': null},
						{'id': '211481', 'name': '兴城市', 'children': null}
					]
				}
			]
		},
		{
			'id': '610000',
			'name': '陕西省',
			'children': [
				{
					'id': '610100',
					'name': '西安市',
					'children': [
						{'id': '610101', 'name': '市辖区', 'children': null},
						{'id': '610102', 'name': '新城区', 'children': null},
						{'id': '610103', 'name': '碑林区', 'children': null},
						{'id': '610104', 'name': '莲湖区', 'children': null},
						{'id': '610111', 'name': '灞桥区', 'children': null},
						{'id': '610112', 'name': '未央区', 'children': null},
						{'id': '610113', 'name': '雁塔区', 'children': null},
						{'id': '610114', 'name': '阎良区', 'children': null},
						{'id': '610115', 'name': '临潼区', 'children': null},
						{'id': '610116', 'name': '长安区', 'children': null},
						{'id': '610122', 'name': '蓝田县', 'children': null},
						{'id': '610124', 'name': '周至县', 'children': null},
						{'id': '610125', 'name': '户　县', 'children': null},
						{'id': '610126', 'name': '高陵县', 'children': null}
					]
				},
				{
					'id': '610200',
					'name': '铜川市',
					'children': [
						{'id': '610201', 'name': '市辖区', 'children': null},
						{'id': '610202', 'name': '王益区', 'children': null},
						{'id': '610203', 'name': '印台区', 'children': null},
						{'id': '610204', 'name': '耀州区', 'children': null},
						{'id': '610222', 'name': '宜君县', 'children': null}
					]
				},
				{
					'id': '610300',
					'name': '宝鸡市',
					'children': [
						{'id': '610301', 'name': '市辖区', 'children': null},
						{'id': '610302', 'name': '渭滨区', 'children': null},
						{'id': '610303', 'name': '金台区', 'children': null},
						{'id': '610304', 'name': '陈仓区', 'children': null},
						{'id': '610322', 'name': '凤翔县', 'children': null},
						{'id': '610323', 'name': '岐山县', 'children': null},
						{'id': '610324', 'name': '扶风县', 'children': null},
						{'id': '610326', 'name': '眉　县', 'children': null},
						{'id': '610327', 'name': '陇　县', 'children': null},
						{'id': '610328', 'name': '千阳县', 'children': null},
						{'id': '610329', 'name': '麟游县', 'children': null},
						{'id': '610330', 'name': '凤　县', 'children': null},
						{'id': '610331', 'name': '太白县', 'children': null}
					]
				},
				{
					'id': '610400',
					'name': '咸阳市',
					'children': [
						{'id': '610401', 'name': '市辖区', 'children': null},
						{'id': '610402', 'name': '秦都区', 'children': null},
						{'id': '610403', 'name': '杨凌区', 'children': null},
						{'id': '610404', 'name': '渭城区', 'children': null},
						{'id': '610422', 'name': '三原县', 'children': null},
						{'id': '610423', 'name': '泾阳县', 'children': null},
						{'id': '610424', 'name': '乾　县', 'children': null},
						{'id': '610425', 'name': '礼泉县', 'children': null},
						{'id': '610426', 'name': '永寿县', 'children': null},
						{'id': '610427', 'name': '彬　县', 'children': null},
						{'id': '610428', 'name': '长武县', 'children': null},
						{'id': '610429', 'name': '旬邑县', 'children': null},
						{'id': '610430', 'name': '淳化县', 'children': null},
						{'id': '610431', 'name': '武功县', 'children': null},
						{'id': '610481', 'name': '兴平市', 'children': null}
					]
				},
				{
					'id': '610500',
					'name': '渭南市',
					'children': [
						{'id': '610501', 'name': '市辖区', 'children': null},
						{'id': '610502', 'name': '临渭区', 'children': null},
						{'id': '610521', 'name': '华　县', 'children': null},
						{'id': '610522', 'name': '潼关县', 'children': null},
						{'id': '610523', 'name': '大荔县', 'children': null},
						{'id': '610524', 'name': '合阳县', 'children': null},
						{'id': '610525', 'name': '澄城县', 'children': null},
						{'id': '610526', 'name': '蒲城县', 'children': null},
						{'id': '610527', 'name': '白水县', 'children': null},
						{'id': '610528', 'name': '富平县', 'children': null},
						{'id': '610581', 'name': '韩城市', 'children': null},
						{'id': '610582', 'name': '华阴市', 'children': null}
					]
				},
				{
					'id': '610600',
					'name': '延安市',
					'children': [
						{'id': '610601', 'name': '市辖区', 'children': null},
						{'id': '610602', 'name': '宝塔区', 'children': null},
						{'id': '610621', 'name': '延长县', 'children': null},
						{'id': '610622', 'name': '延川县', 'children': null},
						{'id': '610623', 'name': '子长县', 'children': null},
						{'id': '610624', 'name': '安塞县', 'children': null},
						{'id': '610625', 'name': '志丹县', 'children': null},
						{'id': '610626', 'name': '吴旗县', 'children': null},
						{'id': '610627', 'name': '甘泉县', 'children': null},
						{'id': '610628', 'name': '富　县', 'children': null},
						{'id': '610629', 'name': '洛川县', 'children': null},
						{'id': '610630', 'name': '宜川县', 'children': null},
						{'id': '610631', 'name': '黄龙县', 'children': null},
						{'id': '610632', 'name': '黄陵县', 'children': null}
					]
				},
				{
					'id': '610700',
					'name': '汉中市',
					'children': [
						{'id': '610701', 'name': '市辖区', 'children': null},
						{'id': '610702', 'name': '汉台区', 'children': null},
						{'id': '610721', 'name': '南郑县', 'children': null},
						{'id': '610722', 'name': '城固县', 'children': null},
						{'id': '610723', 'name': '洋　县', 'children': null},
						{'id': '610724', 'name': '西乡县', 'children': null},
						{'id': '610725', 'name': '勉　县', 'children': null},
						{'id': '610726', 'name': '宁强县', 'children': null},
						{'id': '610727', 'name': '略阳县', 'children': null},
						{'id': '610728', 'name': '镇巴县', 'children': null},
						{'id': '610729', 'name': '留坝县', 'children': null},
						{'id': '610730', 'name': '佛坪县', 'children': null}
					]
				},
				{
					'id': '610800',
					'name': '榆林市',
					'children': [
						{'id': '610801', 'name': '市辖区', 'children': null},
						{'id': '610802', 'name': '榆阳区', 'children': null},
						{'id': '610821', 'name': '神木县', 'children': null},
						{'id': '610822', 'name': '府谷县', 'children': null},
						{'id': '610823', 'name': '横山县', 'children': null},
						{'id': '610824', 'name': '靖边县', 'children': null},
						{'id': '610825', 'name': '定边县', 'children': null},
						{'id': '610826', 'name': '绥德县', 'children': null},
						{'id': '610827', 'name': '米脂县', 'children': null},
						{'id': '610828', 'name': '佳　县', 'children': null},
						{'id': '610829', 'name': '吴堡县', 'children': null},
						{'id': '610830', 'name': '清涧县', 'children': null},
						{'id': '610831', 'name': '子洲县', 'children': null}
					]
				},
				{
					'id': '610900',
					'name': '安康市',
					'children': [
						{'id': '610901', 'name': '市辖区', 'children': null},
						{'id': '610902', 'name': '汉滨区', 'children': null},
						{'id': '610921', 'name': '汉阴县', 'children': null},
						{'id': '610922', 'name': '石泉县', 'children': null},
						{'id': '610923', 'name': '宁陕县', 'children': null},
						{'id': '610924', 'name': '紫阳县', 'children': null},
						{'id': '610925', 'name': '岚皋县', 'children': null},
						{'id': '610926', 'name': '平利县', 'children': null},
						{'id': '610927', 'name': '镇坪县', 'children': null},
						{'id': '610928', 'name': '旬阳县', 'children': null},
						{'id': '610929', 'name': '白河县', 'children': null}
					]
				},
				{
					'id': '611000',
					'name': '商洛市',
					'children': [
						{'id': '611001', 'name': '市辖区', 'children': null},
						{'id': '611002', 'name': '商州区', 'children': null},
						{'id': '611021', 'name': '洛南县', 'children': null},
						{'id': '611022', 'name': '丹凤县', 'children': null},
						{'id': '611023', 'name': '商南县', 'children': null},
						{'id': '611024', 'name': '山阳县', 'children': null},
						{'id': '611025', 'name': '镇安县', 'children': null},
						{'id': '611026', 'name': '柞水县', 'children': null}
					]
				}
			]
		},
		{
			'id': '710000',
			'name': '台湾省',
			'children': null
		},
		{
			'id': '810000',
			'name': '香港特别行政区',
			'children': null
		},
		{
			'id': '820000',
			'name': '澳门特别行政区',
			'children': null
		}
	];
