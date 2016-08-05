/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-08-01 10:20
 */

/**
 * generator graphql query string
 * @name generatorQueryString
 * @param {String} nick 用户昵称
 * @param {String} tenantId 租户id
 * @param {String} shopId 店铺id
 * @param {String} platName 平台名
 * @returns {String}
 */
const generatorQueryString = (nick = '', tenantId = '', shopId = '', platName = 'taobao') => {
	const generatorQueryParam = (name, fields) => `
	{
	  settings:{
	    data_source: "${name}"
	    query_id:"report-id"
	    pagination:{
	      limit:6
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

	const CustomerQuerySchema = `
		customer:shuyun_searchapi_customer(
			param: ${generatorQueryParam('customer', `[{ type:"str_selector" dimension:"customerno" value:"${nick}" }]`)}
		){
	    flag
	    msg
	    data{
	      data{
          full_name
          sex
          birthday:birth_year
          vip_info
          buyer_credit_lev
          mobile
        }
	    }
	  }
	`;

	const RfmQuerySchema = `
		rfm:shuyun_searchapi_rfm(
	    param: ${generatorQueryParam('rfm', `[{ type:"str_selector" dimension:"dp_id" value:"${tenantId}" } { type:"str_selector" dimension:"buyer_nick" value:"${nick}" }]`)}
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

	const TradeQuerySchema = `
		trade:shuyun_searchapi_trade(
	    param: ${generatorQueryParam('trade', `[{ type:"str_selector" dimension:"buyer_nick" value:"${nick}" }]`)}
	  ){
	    flag
	    msg
	    data{
	      data{
	        buyer_email
	        receiver_state
	        receiver_city
	        receiver_district
	        receiver_address
	        receiver_zip
	      }
	    }
	  }
	`;

	const TagQuerySchema = `
		tags:shuyun_searchapi_tags(
			param:{
        type:"buyer_nick"
        value:"${nick}"
        dp_id:"${tenantId}"
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
	    nickName
	  }
	`;

	const WeiBoQuerySchema = `
		weibo:wxcrm_ccms_userinfo(
			taobaoNick: "${nick}"
		){
			sinawbUserId
		}
	`;

	let queryString = `
		{
			${CustomerQuerySchema}
			${RfmQuerySchema}
			${TradeQuerySchema}
			${TagQuerySchema}
			${WeChatQuerySchema}
			${WeiBoQuerySchema}
		}
	`;

	queryString = `
		{
			${CustomerQuerySchema}
			${RfmQuerySchema}
			${TradeQuerySchema}
			${TagQuerySchema}
		}
	`;

	return queryString;
};

export default generatorQueryString;
