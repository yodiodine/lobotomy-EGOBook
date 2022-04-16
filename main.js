$(function(){
    let full_ab_list;
    let filter_ab_list =[];
    let ChkTagArr = [];
    let selected_gift_list = [];

    fetch("/gift-list.json")
        .then(res=>res.json())
        .then((data)=>{
            full_ab_list = data.list;
            makeAbList(full_ab_list);
        })
        .catch(error=>console.log("fetch에러 발생 : " + error))


    function makeAbList(list) {
        let inner = '';
        $(".abnormality-wrap .wrap ul").html('');
        for(let i=0;i<list.length;i++){
            inner += `<li>
                <input type="checkbox" id="cb${i}" ${list[i].checked == "true" ? "checked" : "" }>
                <label for="cb${i}">
                    <div></div>
                    <div></div>
                </label>
                
                <div class="info-1">
                    <p class="gift">${list[i].gift}</p><p class="pos">${list[i].pos}</p>
                </div>
                
                <div class="info-2">
                    <img src="" alt="">
                </div>

                <div class="info-3">
                    <div>
                        ${list[i].stat.R ? "<span>체력 </span><span>" + list[i].stat.R + "</span>" : ''}
                        ${list[i].stat.W ? "<span>정신력 </span><span>" + list[i].stat.W + "</span>" : ''}
                        ${list[i].stat.B_SC ? "<span>작업성공률 </span><span>" + list[i].stat.B_SC + "</span>" : ''}
                        ${list[i].stat.B_SP ? "<span>작업속도 </span><span>" + list[i].stat.B_SP + "</span>" : ''}
                        ${list[i].stat.P_MV_SP ? "<span>이동속도 </span><span>" + list[i].stat.P_MV_SP + "</span>" : ''}
                        ${list[i].stat.P_AT_SP ? "<span>공격속도 </span><span>" + list[i].stat.P_AT_SP + "</span>" : ''}
                    </div>
                </div>

                <div class="info-4">
                    <span>${list[i].who}</span><span style="float:right">획득확률 : ${list[i].percent}%</span>
                </div>
                </li>`;
        }
        $(".abnormality-wrap .wrap ul").html(inner);


        for(let i=0;i<list.length;i++){
            switch(list[i].grade){
                case "zayin":
                    $(".abnormality-wrap .wrap ul li").eq(i).css({
                        "border-top":"5px solid #22f800" ,
                        "border-left":"1px solid #22f800" ,
                        "border-bottom":"1px solid #22f800" ,
                        "border-right":"1px solid #22f800"
                     });
                    break;
                case "teth":
                    $(".abnormality-wrap .wrap ul li").eq(i).css({
                        "border-top":"5px solid #1aa1ff",
                        "border-left":"1px solid #1aa1ff",
                        "border-bottom":"1px solid #1aa1ff",
                        "border-right":"1px solid #1aa1ff"
                    });
                    break;
                case "he":
                    $(".abnormality-wrap .wrap ul li").eq(i).css({
                        "border-top":"5px solid #fff905",
                        "border-left":"1px solid #fff905",
                        "border-bottom":"1px solid #fff905",
                        "border-right":"1px solid #fff905"
                    });
                    break;
                case "waw":
                    $(".abnormality-wrap .wrap ul li").eq(i).css({
                        "border-top":"5px solid #7a2ff2",
                        "border-left":"1px solid #7a2ff2",
                        "border-bottom":"1px solid #7a2ff2",
                        "border-right":"1px solid #7a2ff2"
                    });
                    break;
                case "aleph":
                    $(".abnormality-wrap .wrap ul li").eq(i).css({
                        "border-top":"5px solid #ff0000",
                        "border-left":"1px solid #ff0000",
                        "border-bottom":"1px solid #ff0000",
                        "border-right":"1px solid #ff0000"
                    });
                    break;
                default: break;
            }
        }
    }

    function makeFilterList(){
        ChkTagArr = [];
        filter_ab_list = [];
        $(".pos-list ul li").each((idx,item)=>{
            if($(item).hasClass("clicked")) { ChkTagArr.push($(item).text()); }
        })
        $(".stat-list ul li").each((idx,item)=>{
            if($(item).hasClass("clicked")) { ChkTagArr.push($(item).data("stat")); }
        })

        ChkTagArr.forEach((item)=>{
            full_ab_list.forEach((item2)=>{
                if( item2.pos == item || item2.stat.hasOwnProperty(item)){
                    if(filter_ab_list.indexOf(item2) < 0) filter_ab_list.push(item2);
                }
            })
        })

        
        // filter_ab_list = full_ab_list.filter(function(val,idx,arr){
        //     ChkTagArr.forEach((val2,idx2,arr2)=>{
        //         if((val.pos == val2 || val.stat.hasOwnProperty(val2)) && filter_ab_list.indexOf(val) < 0)   {
        //             console.log(val)
        //             return val;
        //         }
        //     })
        // })


        makeAbList(filter_ab_list)
    }

    $(".pos-list ul li").click(function(){
        $(this).toggleClass("clicked");
        makeFilterList();
    })
    $(".stat-list ul li").click(function(){
        $(this).toggleClass("clicked");
        makeFilterList();
    })

    $(".tag_reset").click(function(){
        $(".pos-list ul li").removeClass();
        $(".stat-list ul li").removeClass();

        makeAbList(full_ab_list);
    })
    $(".gift_reset").click(function(){
        full_ab_list.forEach((item,idx)=>{
            item.checked = "false";
        })
        selected_gift_list = [];
        $(".pos-list ul li").removeClass();
        $(".stat-list ul li").removeClass();
        makeAbList(full_ab_list);
        makeResultSec();
    })


    $(".abnormality-wrap .wrap ul").on("click","label",function(e){
        
        let _this = $(this);
        let _gift = _this.siblings(".info-1").find(".gift").text();
        let _pos = _this.siblings(".info-1").find(".pos").text();
        
        setTimeout(() => {

            for(let i=0;i<full_ab_list.length;i++){
                if(full_ab_list[i].gift == _gift) {
                    if(full_ab_list[i].checked=="true"){
                        full_ab_list[i].checked = "false";
                        selected_gift_list.forEach((item2,idx2)=>{
                            if(item2.gift == _gift){
                                selected_gift_list.splice(idx2,1);
                            }
                        })
                    }else{
                        let isAlready = false;
                        for(let ii=0;ii<selected_gift_list.length;ii++){
                            if(selected_gift_list[ii].pos == _pos)  { isAlready=true; break; }
                        }
                        if(isAlready == true)   { _this.siblings("input").prop("checked",false);alert("같은 포지션을 두 개 낄 수 없어요!");}
                        else                    { full_ab_list[i].checked = "true"; selected_gift_list.push(full_ab_list[i]); }
                        
                    }
                    break;
                }
            }

            makeResultSec()
        }, 1);
    })
    
    function makeResultSec(){
        $(".calc-wrap .calc_st_c").html('');
        let resR=0;
        let resW=0;
        let resB_SC=0;
        let resB_SP=0;
        let resP_MV_SP=0;
        let resP_AT_SP=0;;

        for(let i=0;i<selected_gift_list.length;i++){
            for(let ii=0;ii<Object.keys(selected_gift_list[i].stat).length;ii++){
                switch(Object.keys(selected_gift_list[i].stat)[ii]){
                    case 'R':
                        $(".calc-wrap .calc_st_c").eq(0).append(`<div><span>${Object.values(selected_gift_list[i].stat)[ii]} (${selected_gift_list[i].pos})</span></div>`);
                        resR+=Object.values(selected_gift_list[i].stat)[ii];
                        break;
                    case 'W':
                        $(".calc-wrap .calc_st_c").eq(1).append(`<div><span>${Object.values(selected_gift_list[i].stat)[ii]} (${selected_gift_list[i].pos})</span></div>`);
                        resW+=Object.values(selected_gift_list[i].stat)[ii];
                        break;
                    case 'B_SC':
                        $(".calc-wrap .calc_st_c").eq(2).append(`<div><span>${Object.values(selected_gift_list[i].stat)[ii]} (${selected_gift_list[i].pos})</span></div>`);
                        resB_SC+=Object.values(selected_gift_list[i].stat)[ii];
                        break;
                    case 'B_SP':
                        $(".calc-wrap .calc_st_c").eq(3).append(`<div><span>${Object.values(selected_gift_list[i].stat)[ii]} (${selected_gift_list[i].pos})</span></div>`);
                        resB_SP+=Object.values(selected_gift_list[i].stat)[ii];
                        break;
                    case 'P_MV_SP':
                        $(".calc-wrap .calc_st_c").eq(4).append(`<div><span>${Object.values(selected_gift_list[i].stat)[ii]} (${selected_gift_list[i].pos})</span></div>`);
                        resP_MV_SP+=Object.values(selected_gift_list[i].stat)[ii];
                        break;
                    case 'P_AT_SP':
                        $(".calc-wrap .calc_st_c").eq(5).append(`<div><span>${Object.values(selected_gift_list[i].stat)[ii]} (${selected_gift_list[i].pos})</span></div>`);
                        resP_AT_SP+=Object.values(selected_gift_list[i].stat)[ii];
                        break;
                }
            }
        }
        $(".res-wrap .res_st_c span").eq(0).text(resR);
        $(".res-wrap .res_st_c span").eq(1).text(resW);
        $(".res-wrap .res_st_c span").eq(2).text(resB_SC);
        $(".res-wrap .res_st_c span").eq(3).text(resB_SP);
        $(".res-wrap .res_st_c span").eq(4).text(resP_MV_SP);
        $(".res-wrap .res_st_c span").eq(5).text(resP_AT_SP);
    }


    $(".search_GA").on("keydown",function(e){
        if(e.keyCode == 13) $(".abnormality-wrap button").click();
    })
    $(".abnormality-wrap button").click(function(){
        let search_str;
        let searched_arr = [];
        search_str = $(".search_GA").val().toLowerCase();
        
        searched_arr = full_ab_list.filter(val => {
            if(val.gift.includes(search_str) || val.who.includes(search_str)) return val;
        })
        
        makeAbList(searched_arr);
    })

})