/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-08-15 11:39
 */

import { assert } from 'chai';

import generatorQueryString from '../queryStringSchema.js';

describe('queryStringSchema', () => {
	it('queryStringSchema', () => {
		const customerInformation = {
			nickName: 's_peggy',
			shopId: '62847409',
			platName: 'taobao',
			tenantId: 'dagouzi01'
		};

		const queryString = `{

		custom_property_basic(
			tenantId: "dagouzi01"
  	  shopId: "62847409"
  	  customerno: "s_peggy"
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

    custom_property_properties(
      tenantId:"dagouzi01"
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

		custom_property_customer(
      customerNo:"s_peggy"
      tenantId:"dagouzi01"
      platform:"taobao"
    ){
      properties{
        id
        name
        type
        optional
        value
        isDisable
      }
    }

    trade:shuyun_searchapi_trade(
	    param: {
	  settings:{
	    data_source: "trade"
	    query_id:"report-id"
	    pagination:{
	      limit: 1
	      offset:0
	    }
	    return_format:"json"
	  }
	  filters:{
	    type:"and"
	    fields: [
	      { type:"str_selector" dimension:"buyer_nick" value:"s_peggy" }
	    ]
	  }
	}
	  ){
	    flag
	    msg
	    data{
	      data{
	       receiver_mobile
	      }
	    }
	  }

	  rfm:shuyun_searchapi_rfm(
	    param: {
	  settings:{
	    data_source: "rfm"
	    query_id:"report-id"
	    pagination:{
	      limit: 10
	      offset:0
	    }
	    return_format:"json"
	  }
	  filters:{
	    type:"and"
	    fields: [
	      { type:"str_selector" dimension:"dp_id" value:"62847409" }
	      { type:"str_selector" dimension:"buyer_nick" value:"s_peggy" }
	    ]
	  }
	}
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

	  tags:shuyun_searchapi_tags(
			param:{
        type:"buyer_nick"
        value:"s_peggy"
        dp_id: "62847409"
        buyer_nick:"s_peggy"
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

		loyalty_member_gpinfo(
      platDpId:"62847409"
      cardNo:"s_peggy"
    ){
      cardGradeName
      effectTime
      expireTime
      currentPoint
      totalGet
    }
		memberInfo:loyalty_member_info(
      platDpId:"62847409"
      cardNo:"s_peggy"
    ){
      actionInfo{
				signCount
      }
      orderInfo{
				exchangeCount
      }
    }

    wechat:wxcrm_ccms(
	    platCustNo: "s_peggy"
	    platId: "taobao"
	    platShopId: "62847409"
	  ){
	    platId
	    platShopId
	    platCustNo
	    weChatPublicNumber
	    openid
	    wechatNick:nickName
	  }

	  weibo:wxcrm_ccms_userinfo(
			taobaoNick: "s_peggy"
		){
			sinawbUserId
			sinawbUserName
		}
		}`;

		assert.deepEqual(generatorQueryString(customerInformation.nickName, customerInformation.shopId, customerInformation.platName, customerInformation.tenantId).replace(/\s/g, ''), queryString.replace(/\s/g, ''));
	});
});
