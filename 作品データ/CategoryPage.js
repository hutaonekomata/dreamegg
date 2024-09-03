const setpoint=document.getElementById('setpoint');//コンテンツの表示の基準 該当URL
const searchset=document.getElementById('searchset');
const home=document.getElementById('home');
function searchopen(){//検索ページを開く
    const searchber=document.getElementById('searchber');
    if(searchber==null){
        //searchset.className='cal-7';
        searchset.insertAdjacentHTML('beforebegin','<div class="col-3" class="sidebar_fixed" id="searchber"><h5>検索</h5><input type="text" id="keyword" value="'+localStorage.getItem("keyword")+'"><button type="button" id="searchReset">リセット</button></input></div>');
        localStorage.setItem("searchCheck",1);
        const searchkey=document.getElementById('keyword');
        const searchReset=document.getElementById('searchReset');
        searchkey.addEventListener("keydown",function(){
            if(event.key==='Enter'){
                if(searchkey!=null){
                    localStorage.setItem('keyword',searchkey.value)
                    window.location.reload();
                }
            }
        });
        searchReset.addEventListener('click',searchreset,false);
    }
    else{
        searchber.remove();
        localStorage.setItem("searchCheck",0);
    }
}
function searchreset(){
    localStorage.setItem('keyword',"");
    window.location.reload();
}
let popupwindow=null;

document.getElementById('button').addEventListener('click',searchopen,false);
/*
document.getElementById('add').onclick=function(){
    //popupwindow=window.open("登録ページ.html","popupWindow")//登録ページを開く
};*/

window.onload=function onload(){//ページが更新されたら
    document.getElementById('ctName').innerHTML=localStorage.getItem('CategoryName');//カテゴリー名表示
    const searchcatgry=localStorage.getItem('CategoryName');//ローカルストレージのコンテンツ表示のため、カテゴリー名を変数に代入
    for(let i=0;i<localStorage.length;i++){//すべてのローカルストレージのデータを確認するためのループ
        const key=localStorage.key(i);//i番目のローカルストレージのキー名を代入
        let json=localStorage.getItem(key);//i番目のローカルストレージのvalueを代入(配列変換用)
        var nowbasedeta=new Array;//ローカルストレージのデータの代入用配列の宣言
        var nowdeta=new Array;
        if(key.includes(searchcatgry)){//該当するカテゴリーのコンテンツだったら
            nowbasedeta=JSON.parse(json);//文字データを配列に変換
            nowdeta[0]=nowbasedeta[1].replace('Name','');
            nowdeta[1]=nowbasedeta[0].replace('URL','');
            nowdeta[2]=nowbasedeta[2].replace('tag','');
            //nowdeta[3]=nowbasedeta[3].replace('3Dodj_link','');
            //alert(includes(nowdeta[0]));
            if(localStorage.getItem('keyword')==null||nowdeta[0].includes(localStorage.getItem('keyword'))||nowdeta[2].includes(localStorage.getItem("keyword"))){
                setpoint.insertAdjacentHTML('afterend','<section id="sec" class="sec"><h7>タイトル</h7><div class="content"><a href="リンク先.html" class="content-link"><p>リンク</p></a><p class="content-setup">設定</p></div></section>');
                //セクションを入力
                const idName="sec"+i;//id名を代入
                const idChe=document.getElementById('sec');//セクションのようそを得る
                idChe.id=idName;//idを変更
                document.getElementById(idName).innerHTML='<iframe src="./model.html" id="renderCanvas6" title="Viewer demo" scrolling="no" frameborder="no" loading="lazy"></iframe><h7>名前：'+nowdeta[0]+'</h7><div class="content"><p>リンク：</p><a href="'+nowdeta[1]+'" target="_blank" class="content-link"><p>'+nowdeta[1].substr(0,50)+'</p></a><p class="content-setup" id="'+nowdeta[0]+'">編集</p><p class="content-setup" id="'+nowdeta[0]+'Delete">削除</p></div>';
                //document.getElementById(idName).innerHTML='<h7>名前：'+nowdeta[0]+'</h7><div class="content"><p>リンク：</p><a href="'+nowdeta[1]+'" target="_blank" class="content-link"><p>'+nowdeta[1].substr(0,50)+'</p></a><p class="content-setup" id="'+nowdeta[0]+'">編集</p><p class="content-setup" id="'+nowdeta[0]+'Delete">削除</p></div>';
                //セクションの内容を変更
                /*
                document.getElementById(nowdeta[0]).addEventListener('click',function(){
                    localStorage.setItem('edit',event.target.id);
                });*/
                document.getElementById(nowdeta[0]+'Delete').addEventListener('click',function(){
                    localStorage.removeItem(localStorage.getItem('CategoryName')+'_'+event.target.id.replace('Delete',''));//文字の引き算
                    window.location.reload();
                });
            }
        }
    }
    if(localStorage.getItem('searchCheck')==1){
        searchopen();
    }
}

/*
window.addEventListener('storage',function(){
    window.location.reload();//ローカルストレージが変更されたら更新する
});*/

home.addEventListener('click',function(){
    localStorage.removeItem('keyword');
    localStorage.removeItem('searchCheck');
    location.href = "./hub.html"
    //window.close();
})
