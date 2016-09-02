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
			platName: 'taobao'
		};

		const queryString = `{

		customer:shuyun_searchapi_customer(
			param:
	{
	  settings:{
	    data_source: "customer"
	    query_id:"report-id"
	    pagination:{
	      limit: 1
	      offset:0
	    }
	    return_format:"json"
	  }
	  filters:{
	    type:"and"
	    fields: [{ type:"str_selector" dimension:"customerno" value:"s_peggy" }]
	  }
	}

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

		trade:shuyun_searchapi_trade(
	    param:
	{
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
	    fields: [{ type:"str_selector" dimension:"buyer_nick" value:"s_peggy" }]
	  }
	}

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

		loyalty_member_gpinfo(
      platDpId:"62847409"
      cardNo:"s_peggy"
    ){
      cardGrade
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

		assert.deepEqual(generatorQueryString(customerInformation.nickName, customerInformation.shopId, customerInformation.platName).replace(/\s/g, ''), queryString.replace(/\s/g, ''));
	});
});
