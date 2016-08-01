/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-08-01 10:20
 */

const generatorQueryString = (nick = '', platCustNo = '', platId = '', platShopId = '') => {
	const COMMONQUERYPARAM = `
	{
	  settings:{
	    data_source:"trade"
	    query_id:"report-id"
	    pagination:{
	      limit:6
	      offset:0
	    }
	    return_format:"json"
	  }
	  filters:{
	    type:"and"
	    fields:[{
	      type:"str_selector"
	      dimension:"buyer_nick"
	      value:"${nick}"
	    }]
	  }
	}
	`;

	const TradeQuerySchema = `
		trade:shuyun_searchapi_trade(
	    param: ${COMMONQUERYPARAM}
	  ){
	    flag
	    msg
	    data{
	      data{
	        receiver_name
	        receiver_mobile
	        buyer_email
	        receiver_state
	        receiver_city
	        receiver_district
	        receiver_address
	        receiver_zip

	        sex
	        birthday
	        age
	        job
	        vip_info
	        buyer_credit_lev
	      }
	    }
	  }
	`;

	const RfmQuerySchema = `
		rfm:shuyun_searchapi_rfm(
	    param: ${COMMONQUERYPARAM}
	  ){
	    flag
	    msg
	    data{
	      data{
	        trade_first_time
	        trade_first_amount
	        trade_last_time
	        trade_last_amount
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

	        trade_first_interval
	        trade_last_interval
	      }
	    }
	  }
	`;

	const WeChatQuerySchema = `
		wechat:wxcrm_ccms(
	    platCustNo: "${platCustNo}"
	    platId: "${platId}"
	    platShopId: "${platShopId}"
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
			${TradeQuerySchema}
			${RfmQuerySchema}
			${WeChatQuerySchema}
			${WeiBoQuerySchema}
		}
	`;

	// test use
	queryString = `
		{
			${WeChatQuerySchema}
			${WeiBoQuerySchema}
		}
	`;

	return queryString;
};

export default generatorQueryString;
