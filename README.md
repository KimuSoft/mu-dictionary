# mu-dictionary
우리만의 조금 특별한 사전

![image](https://user-images.githubusercontent.com/47320945/194694784-b586fd7b-0613-4d67-afff-92badc5c9c67.png)

![image](https://user-images.githubusercontent.com/47320945/194694781-a9c792e7-2236-4ab0-8975-2e79750fe65a.png)

## 도커 세팅
* 빌드에서 세팅까지 한 방에!
```shell
docker-compose up -d --build
```

## DB 관리
### 특정 출처 삭제하기
```shell
use mudictionary
db.words.deleteMany({reference: "출처 코드"})
```