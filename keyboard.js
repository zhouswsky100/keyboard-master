angular.module('starter.directive', [])
.directive('keyboard', function($compile,$rootScope) {
    return {
        restrict : 'AE',  
        transclude : true,
        template:'',
        scope:{   
          myName:'=name',
          password:"=password",
          ngBlur:"&"
        },
        link : function(scope, element, attrs) {
            var numlist1=[["1","2","3"],["4","5","6"],["7","8","9"],[".","0","back"]];//输入金额的时候，type=v1;
            var numlist2=[["1","2","3"],["4","5","6"],["7","8","9"],["","0","back"]];//输入手机号的时候，type=v2;
            var numlist=[["1","2","3"],["4","5","6"],["7","8","9"],["ABC","0","back"]];//全键盘
            var wordlist=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["up","z","x","c","v","b","n","m","back"],["123","space","#+="]];
            var speCharslist=[
                            ["!","@","#","$","%","^","&","*","(",")"],
                            ["&acute;","&quot;","=","_",":",";","?","~","|","·"],
                            ["+","-","\\","\/","[","]","{","}","back"],
                            ["123",",",".","&lt;","&gt;","€","￡","¥","ABC"]
                          ];
            scope.numberShow = "show";
            scope.characterShow = "hidden";
            scope.scShow = "hidden";
            scope.myName = "";
            scope.password = "";
            scope.lowerOrUp = "lower";
            var calculator="";
            var boardtype = attrs.boardtype;//键盘类型，v1表示数字键盘+点,应用场景：金额；v2表示纯数字键盘，应用场景：电话号码，其他表示全键盘
           // var passwordtype = attrs.password;//是否是password，需要格式化为黑点；
            $rootScope.placeTxt = attrs.placeholder;//记录当前的placehodler，缓存下来，用于doucument.click的时候
            scope.render = function(){
              calculator = '<div class="keyboard" class="ngcalculator_area" ng-click="wrapperBlank()">'
               +'<div class="title"><span>合拍在线安全健盘</span><span class="finish" ng-click="finish($event)">完成</span></div>'
               +'<div class="con"><ul class="number {{numberShow}}" ng-class="{{numberShow}}"><li>';
              var common = function(list,type){
                angular.forEach(list,function(v,k){
                  calculator += '<li>';
                  angular.forEach(v,function(v1,k1){
                    if(v1=="back"){
                      calculator += '<span class="ion-backspace-outline backColor" ng-click="change(\''+v1+'\',$event)"></span>';
                    }else if(v1=="up"){
                      calculator += '<span class="ion-arrow-up-a" ng-click="change(\''+v1+'\',$event)"></span>';
                    }else if(v1=="ABC"||v1=="123"||v1=="#+="){
                      calculator += '<span ng-click="change(\''+v1+'\',$event)">'+v1+'</span>';
                    }else if(v1=="space"){
                      calculator += '<span>'+v1+'</span>';
                    }else if(v1==""){
                      calculator += '<span class="nullColor"></span>';
                    }else{
                      if(v1 == "\\"){
                        scope.key = v1;
                        calculator += '<span ng-click="clickKey(key,$event)">'+v1+'</span>';
                      }else{
                        if(type){//如果是字母，则需要大小写可以变化
                          calculator += '<span class="{{lowerOrUp}}" ng-click="clickKey(\''+v1+'\',$event)">'+v1+'</span>';
                        }else{
                          calculator += '<span class="word" ng-click="clickKey(\''+v1+'\',$event)">'+v1+'</span>';
                        }
                      }
                    }
                  });
                  calculator += '</li>';
                });
              }
              if(boardtype == "v1"){
                common(numlist1,false);
              }else if(boardtype == "v2"){
                common(numlist2,false);
              }else{
                common(numlist,false);
              }
              calculator += '</ul><ul class="character hidden {{characterShow}}">';
              common(wordlist,true);
              calculator += '</ul><ul class="specialCharacter hidden {{scShow}}">';
              common(speCharslist,false);
              calculator += "</ul></div></div>";
            }
            scope.wrapperBlank = function(){
              event.stopPropagation();
            }
            //init keyboard
            scope.initKeyboardStyle=function(){
              scope.numberShow = "show";
              scope.characterShow = "hidden";
              scope.scShow = "hidden";
              scope.lowerOrUp = "lower";
            }
            var node = document.getElementsByClassName('keyboard');
            //键盘聚焦弹起定制键盘，隐藏原生键盘
            element.bind('focus',function(e){
              event.stopPropagation();
              //$rootScope.placeTxt1 = angular.element(e.target)[0].getAttribute("placeholder");
              $rootScope.placeTxt = attrs.placeholder;
              
              element.addClass("activeInput");//记录当前的input框
              for(var i=0;i<node.length;i++){
                node[i].remove();
              }
              scope.render();
              scope.initKeyboardStyle();
              calculator = $compile(calculator)(scope);
              document.body.appendChild(calculator[0]); 
              document.activeElement.blur();
              angular.element(element.next())[0].style.display="inline-block";
              angular.element(e.target)[0].setAttribute("placeholder","");
              
            });

            document.getElementsByTagName('body')[0].onclick=function(e){
              scope.finish();
              scope.cursor();
              var ele = document.getElementsByClassName('activeInput')[0];
              if(ele && ele.value.length == 0){   
                ele.setAttribute("placeholder",$rootScope.placeTxt);
                angular.element(ele).removeClass("activeInput");
              }
            };
            //关闭模态框
            scope.finish = function(e){
              event.stopPropagation();
              scope.initKeyboardStyle();
              var node = document.getElementsByClassName('keyboard');
              angular.element(node).remove();
              scope.cursor();//屏蔽光标
              scope.initPlace();//初始化placeholder
              element.removeClass("activeInput");
              if(typeof(scope.ngBlur()) !="undefined"){
                scope.ngBlur();
              }
            }
            //光标控制
            scope.cursor = function(){
              var node1=document.getElementsByClassName('imitateCursor');
              for(var i=0;i<node1.length;i++){
                node1[i].style.display="none";
              }
            }
            //输入字符
            scope.clickKey=function (word,e) {
              event.stopPropagation();

              if(scope.lowerOrUp=="up"){
                scope.myName += word.toUpperCase();
                scope.password += word.toUpperCase();
              }else{
                scope.myName += word.toLowerCase();
                scope.password += word.toLowerCase();
              }
              if(typeof(attrs.password) !="undefined"){
                scope.myName = scope.myName.replace(/./g,'·');//输入的是密码，要进行转换
              }
              if(boardtype == "v1"){//输入金额
                var returnText = scope.myName;
                if(!returnText){
                  return;
                }
                var regStrs = [
                  ['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0
                  ['[^\\d\\.]+$', ''], //禁止录入任何非数字和点
                  ['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点
                  ['^(\\d+\\.\\d{2}).+', '$1'] //禁止录入小数点后两位以上
                ];

                for (i = 0; i < regStrs.length; i++) {
                  var reg = new RegExp(regStrs[i][0]);
                  returnText = returnText.replace(reg, regStrs[i][1]);
                }

                scope.myName =  returnText;
              }
              
            }
            scope.initPlace = function(){
              if(scope.myName.length == 0){
                element[0].setAttribute("placeholder",attrs.placeholder);
              } 
            }
            //切换键盘
            scope.change = function(tag,e){
              e.stopPropagation();
              switch(tag){
                case "123":
                  scope.numberShow = "show";
                  scope.characterShow = "hidden";
                  scope.scShow = "hidden";
                  break;
                case "ABC":
                scope.numberShow = "hidden";
                scope.characterShow = "show";
                scope.scShow = "hidden";
                  break;
                case "#+=":
                  scope.numberShow = "hidden";
                  scope.characterShow = "hidden";
                  scope.scShow = "show";
                  break;
                case "back":
                  if(scope.myName.length>=1){
                    scope.myName=scope.myName.substring(0,scope.myName.length-1);
                    scope.password=scope.password.substring(0,scope.password.length-1);
                  }else{
                    scope.myName="";
                    scope.password="";
                  }
                  scope.initPlace();                 
                  break;
                case "up":
                  if(scope.lowerOrUp == "lower"){
                    scope.lowerOrUp = "up";
                  }else{
                    scope.lowerOrUp = "lower";
                  }
                  break;
                default:
                  break;
              }

            }
        }
    };
});
;