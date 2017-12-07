/**
 * 체크리스트
 *
 * jj-choi
 *
 **/

angular.module('bnk-common.directive')
.directive('checkPop', function ($rootScope, $timeout) {

/* ####################################################################################
 * ## 팝업 상수설정														  				 ##
 * #################################################################################### */

	var PARENT_ID = 'wrap_back';				// 고정
	var TEMPLATE_ID = 'check-pop';	// 변경 <= 팝업ID(폴더,파일명)

/* #################################################################################### */

	return {

		/* [scope 옵션]
		 * 	 - scope : false -> 새로운 scope 객체를 생성하지 않고 부모가 가진 같은 scope 객체를 공유. (default 옵션)
		 * 	 - scope : true -> 새로운 scope 객체를 생성하고 부모 scope 객체를 상속.
		 * [binding 옵션]
		 *   - = : 부모 scope의 property와 디렉티브의 property를 data binding하여 부모 scope에 접근
		 *   - @ : 디렉티브의 attribute value를 {{}}방식(interpolation)을 이용해 부모 scope에 접근
		 *   - & : Two-way Binding 없이 각 Directive에서 사용하는 데이터를 상위 스코프로 전달할 수 있다.
		 */
		scope: {
			oParams: '=params',
			onLoadCallback: '&onLoadCallback'
		},
		restrict: 'E',		// E : elements, A : attributes, C : class name (CSS), M : comments
		replace: true, 		// directive를 설정한 태그를 템플릿 태그로 교체하고자 할때 따라서 template 또는 templateUrl과 함께 사용한다
//		transclude: false,	// ngTransclude를 통하여 DOM에 transcluded DOM을 insert 할 수 있다
//							// transcluded DOM을 template에서 ngTransclude directive에 삽입한다
		link: function(scope, element, attrs) {
			scope.contentUrl = BNK_CTX + '/front/js/popup/bnk-'+ TEMPLATE_ID +'/bnk-'+ TEMPLATE_ID +'-template.html';
	       },
		template: '<div id="'+TEMPLATE_ID+'" ng-include="contentUrl"></div>',
		controller: function($scope, $http, $timeout){

			// 팝업 초기화
			$scope.$this = {};	// 팝업객체
			$scope.templateInit = function(){
				$scope.$this = ITCButton.initPopup(angular.element('#'+TEMPLATE_ID).find('.popupWrap'), 'full');
				ITCButton.setupTypePopup(angular.element('#'+TEMPLATE_ID).find('.popupWrap'));
				ITCButton.setupTypeAccordion();	//아코디언 초기화

				$scope.$this.onOpenHandle = function(){
					$("input[type=checkbox]").prop("checked",false);
				};

				$rootScope.$broadcast(TEMPLATE_ID, {});
			};

			$scope.sendClick = function(){
				$scope.items = [];
				$("input[name='items[]']:checked").each(function (){
					$scope.items.push($(this).val());
				});

				if($scope.items.length == 0){
					alert("항목을 하나라도 체크해주세요.");
					return;
				}

				// 푸시전송 하기전 어떤 화면에서 넘어왔는지 값을 전달한다.
				$("#type").val("C");			// C: 체크리스트
				$("#items").val($scope.items);	// items

				ITCButton.getPopup('.popSend').open();
			};


			$scope.doFocus=function($event){
				if ($event.stopPropagation) $event.stopPropagation();		//이벤트 버블링 해제
				var $dl = $($event.target).closest('dl');
				$dl.find('.accordionData input[type=checkbox]:eq(0)').focus();
			}

			$scope.onClose = function(){
				// callback function
				$scope.onLoadCallback({ 'id': TEMPLATE_ID, 'data': {} });
			};

		}
	};
});
