
onload = () => {
	console.log("welcome chatting room")
	
	let ip = window.location.host;
	console.log(ip);

	let root = getContextPath()
	console.log(root)

   
// 채팅 서버 주소
	let url = "ws://" + ip + root +"/chatserver"
	
// 	학원컴
//	let url = "ws://192.168.0.93:9090/hospital_final/"; 
//	집 거실
//	let url = "ws://192.168.0.24:9091/hospital_final/";
//	집 내방	
//	let url = "ws://192.168.0.7:9091/hospital_final/";
	
	
// 웹 소켓
	let ws;
	
//연결하기
	let btnConnect = document.querySelector('#btnConnect')
	
	btnConnect.addEventListener('click', event => {
			 
			 // 유저명 확인
			 if ($('#user').val().trim() != '') {
				 
				 // 웹소켓 객체 생성, 연결이벤트 발생
				 ws = new WebSocket(url);
				 
				 
				 // < 소켓 이벤트 매핑 >
				  
				 
				 ws.onopen = function (evt) {
					 
					 console.log('서버 연결 성공');
					 print($('#user').val(), '입장했습니다.');
					 
					 // 현재 사용자가 입장했다고 서버에게 통지(유저명 전달)
					 // -> 1#유저명
					 ws.send('1#' + $('#user').val() + '#');
					 
					 $('#user').attr('readonly', true);
					 $('#btnConnect').attr('disabled', true);
					 $('#btnDisconnect').attr('disabled', false);
					 $('#msg').attr('disabled', false);
					 $('#msg').focus();
				 };
				 
				 // 서버로부터 메세지 수신될 시
				 ws.onmessage = function (evt) {
					 
					 // evt.data : 수신된 메세지
					 let index = evt.data.indexOf("#", 2);
					 let no = evt.data.substring(0, 1); 	// 메세지 종류
					 let user = evt.data.substring(2, index);
					 let txt = evt.data.substring(index + 1);
					 
					 if (no == '1') {
						 print2(user);
					 } else if (no == '2') {		// [2#] 2#1101 - 권지용:ㅇㅇㅇㅇ 오후 2:39:27
						 print(user, txt);
					 } else if (no == '3') {
						 print3(user);
					 }
					 $('#list').scrollTop($('#list').prop('scrollHeight'));
				 };
				 
				 // 에러이벤트, close() 실행 시 
				 ws.onclose = function (evt) {
					 console.log('소켓이 닫힙니다.');
				 };
				 
				 // 연결시도중 에러 발생 시 
				 ws.onerror = function (evt) {
					 console.log(evt.data);
					 ws.close()
				 };
				 
			 } else {
				 alert('유저명을 입력하세요.');
				 $('#user').focus();
				 console.log(" 접속실패")
			 }

		 
	});
		 
// 유저명 & 대화내용 
		 function print(user, txt) {
			 let temp = '';
			 temp += '<div style="margin-bottom:3px;">';
			 temp += '[' + user + '] ';
			 temp += txt;
			 temp += ' <span style="font-size:11px;color:#777;">' + new Date().toLocaleTimeString() + '</span>';
			 temp += '</div>';
			 
			 $('#list').append(temp);
		 }
		 
// 다른 client 접속 통지		
		 function print2(user) {
			 let temp = '';
			 temp += '<div style="margin-bottom:3px;">';
			 temp += "'" + user + "' 님이 접속했습니다." ;
			 temp += ' <span style="font-size:11px;color:#777;">' + new Date().toLocaleTimeString() + '</span>';
			 temp += '</div>';
			 
			 $('#list').append(temp);
		 }
		 
// client 접속 종료 통지
		 function print3(user) {
			 let temp = '';
			 temp += '<div style="margin-bottom:3px;">';
			 temp += "'" + user + "' 이(가) 종료했습니다." ;
			 temp += ' <span style="font-size:11px;color:#777;">' + new Date().toLocaleTimeString() + '</span>';
			 temp += '</div>';
			 
			 $('#list').append(temp);
		 }

	
//	연결 시		 
		 $('#user').keydown(function() {
			 if (event.keyCode == 13) {		// 엔터키 누르면 연결버튼 클릭
				 $('#btnConnect').click();
			 }
		 });

//	전송 시
		 $('#msg').keydown(function() {
			 if (event.keyCode == 13) {		// 엔터키 누르면 메세지 전송
				 
				 // WebSocket의 send() :서버로 메세지 전송
				 // 2#유저명#메시지
				 ws.send('2#' + $('#user').val() + '#' + $(this).val()); //서버에게
				 print($('#user').val(), $(this).val()); //본인 대화창에
				 $('#list').scrollTop($('#list').prop('scrollHeight'));
				 $('#msg').val('');
				 $('#msg').focus();
				 
			 }
		 });

//	종료시
		 $('#btnDisconnect').click(function() {
			 ws.send('3#' + $('#user').val() + '#');	
			 ws.close();
			 
			 $('#user').attr('readonly', false);
			 $('#user').val('');
			 
			 $('#btnConnect').attr('disabled', false);
			 $('#btnDisconnect').attr('disabled', true);
			 
			 $('#msg').val('');
			 $('#msg').attr('disabled', true);
		 });
		
}

function getContextPath() {
	let hostIndex = location.href.indexOf(location.host) + location.host.length
	let contextPath = location.href.substring(hostIndex, location.href.indexOf('/', hostIndex + 1))
	return contextPath
}


