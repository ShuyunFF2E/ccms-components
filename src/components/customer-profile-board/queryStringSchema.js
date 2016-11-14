/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-08-01 10:20
 */

/**
 * @name generatorQueryParam
 * @param {String} name
 * @param {String} fields
 * @param {Number} limit
 * generator query param of graphql query string
 */
const generatorQueryParam = (name = '', fields = '[]', limit = 1) => `
	{
	  settings:{
	    data_source: "${name}"
	    query_id:"report-id"
	    pagination:{
	      limit: ${limit}
	      offset:0
	    }
	    return_format:"json"
	  }
	  filters:{
	    type:"and"
	    fields: ${fields}
	  }
	}
	`;

/**
 * @name generatorQueryString
 * @param {String} nick 用户昵称
 * @param {String} shopId 店铺id
 * @param {String} platName 平台名
 * @returns {String}
 * generator graphql query string
 */
const generatorQueryString = (nick = '', shopId = '', platName = 'taobao', tenantId = '') => {
	const customPropertyBasic = `
		custom_property_basic(
			tenantId: "${tenantId}"
  	  shopId: "${shopId}"
  	  customerno: "${nick}"
    ){
      message
      username
      sex
      birthday
      age
      mobile
      email
      level
      creditrating
      favorablerate
      province
      city
      locality
      address
      postcode
    }
	`;

	const customPropertyProperties = `
		custom_property_properties(
      tenantId:"${tenantId}"
    ){
      data{
        id
        name
        type
        optional
        tenantId
        operator
        createTime
        isDisable
        remark
      }
    }
	`;

	const customPropertyCustomer = `
		custom_property_customer(
      customerNo:"${nick}"
      tenantId:"${tenantId}"
      platform:"${platName}"
    ){
      properties{
        id
        name
        type
        optional
        value
      }
    }
	`;

	const TradeQuerySchema = `
		trade:shuyun_searchapi_trade(
	    param: ${generatorQueryParam('trade', `[{ type:"str_selector" dimension:"buyer_nick" value:"${nick}" }]`)}
	  ){
	    flag
	    msg
	    data{
	      data{
	       receiver_mobile
	      }
	    }
	  }
	`;

	const RfmQuerySchema = `
		rfm:shuyun_searchapi_rfm(
	    param: ${generatorQueryParam('rfm', `[{ type:"str_selector" dimension:"dp_id" value:"${shopId}" } { type:"str_selector" dimension:"buyer_nick" value:"${nick}" }]`, 10)}
	  ){
	    flag
	    msg
	    data{
	      data{
	        period
	        trade_first_time
	        trade_first_amount
	        trade_first_interval
	        trade_last_time
	        trade_last_amount
	        trade_last_interval
	        trade_tidcount
	        trade_count
	        trade_amount
	        trade_item_num
	        trade_avg_amount
	        trade_avg_item_num
	        trade_avg_buy_interval
	        trade_refund_count
	        trade_refund_amount
	        trade_avg_confirm_interval
	        trade_max_amount
	        trade_order_discount_fee
	      }
	    }
	  }
	`;

	const TagQuerySchema = `
		tags:shuyun_searchapi_tags(
			param:{
        type:"buyer_nick"
        value:"${nick}"
        dp_id: "${shopId}"
        buyer_nick:"${nick}"
      }){
	      result{
          bfm
          ccc
          company_employ
          date_unknown
          discount_sense1
          discount_sense2
          discount_sense3
          discount_sense4
          discount_sense5
          family
          female
          finance_institute
          foodlover
          gov_institute
          hospital
          houseman
          jhs
          job_unknown
          jyet
          life_unknown
          male
          mall
          nbnm
          non_jhs
          non_shouji
          pingshigou
          school
          sex_unknown
          shangbangou
          shouji
          sportman
          time_unknown
          wanjiangou
          yemaozi
          zaochengou
          zhoumogou
          score
        }
	    }
	`;

	const MemberInfoQuerySchema = `
		loyalty_member_gpinfo(
      platDpId:"${shopId}"
      cardNo:"${nick}"
    ){
      cardGrade
      effectTime
      expireTime
      currentPoint
      totalGet
    }
		memberInfo:loyalty_member_info(
      platDpId:"${shopId}"
      cardNo:"${nick}"
    ){
      actionInfo{
				signCount
      }
      orderInfo{
				exchangeCount
      }
    }
	`;

	const WeChatQuerySchema = `
		wechat:wxcrm_ccms(
	    platCustNo: "${nick}"
	    platId: "${platName}"
	    platShopId: "${shopId}"
	  ){
	    platId
	    platShopId
	    platCustNo
	    weChatPublicNumber
	    openid
	    wechatNick:nickName
	  }
	`;

	const WeiBoQuerySchema = `
		weibo:wxcrm_ccms_userinfo(
			taobaoNick: "${nick}"
		){
			sinawbUserId
			sinawbUserName
		}
	`;

	const queryString = `
		{
			${customPropertyBasic}
			${customPropertyProperties}
			${customPropertyCustomer}
			${TradeQuerySchema}
			${RfmQuerySchema}
			${TagQuerySchema}
			${MemberInfoQuerySchema}
			${WeChatQuerySchema}
			${WeiBoQuerySchema}
		}
	`;

	return queryString;
};

export default generatorQueryString;
