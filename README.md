# Projeto DoctorAPI
Consiste em uma simples API que permite o registro de médicos e seus dados.

<p align="center">
  <img  src="https://img.freepik.com/free-vector/cartoon-doctors-nurses_52683-59918.jpg?w=2000" height="240px">
</p>
<h1 align="center">
  DoctorAPI
</h1>
<div align="center">

  <h3>Built With</h3>
  <img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white" height="30px"/>
   <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/typeorm-%23316192.svg?style=for-the-badge&logo=typeorm&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white" height="30px"/>  
</div>

# Description

Nesse desafio foi proposto a criação de uma API que permitisse o registro de médicos, informando os dados pessoais, juntamente com o CEP.
A partir do CEP deve ser feito uma requisição para a API dos correios e pegar as informações do endereço do médico.

## Features

-   Add doctor.
-   Get all registered doctors, Get doctor by queries and params .
-   Update doctor info.
-   Soft delete a doctor.

</br>

### Seed db

```
http://localhost:5000
POST /specialties/seed
```

#### Response:

```json
message: Specialties added!
status: 201
```

####

#

### Get registered specialties

```
http://localhost:5000
GET /specialties
```

#### Response:

```json
status: 200
data:[
  {
		"id": 1,
		"name": "Alergologia",
		"doctors": []
	},
	{
		"id": 2,
		"name": "Angiologia",
		"doctors": []
	},
	{
		"id": 3,
		"name": "Buco maxilo",
		"doctors": []
	},
	{
		"id": 4,
		"name": "Cardiologia clínica",
		"doctors": []
	},
  {
		"id": 5,
		"name": "Cardiologia infantil",
		"doctors": []
	},
	{
		"id": 6,
		"name": "Cirurgia cabeça e pescoço",
		"doctors": []
	},
	{
		"id": 7,
		"name": "Cirurgia cardíaca",
		"doctors": []
	},
	{
		"id": 8,
		"name": "Cirurgia de tórax",
		"doctors": []
	}
]
```

####

#

### Add doctor

```
http://localhost:5000
POST /doctors/add
```

#### Request:

| Body              | Type       | Description                          |
| :---------------- | :--------- | :----------------------------------- |
| `name`            | `string`   | **Required**. doctor name            |
| `crm`             | `string`   | **Required**. doctor crm             |
| `telefoneFixo`    | `string`   | **Required**. doctor telefoneFixo    |
| `telefoneCelular` | `string`   | **Required**. doctor telefoneCelular |
| `cep`             | `string`   | **Required**. doctor cep             |
| `specialties`     | `number[]` | **Required**. doctor specialties     |

`
name:  no máximo 120 caractéres
`

`
crm: no máximo 7 caracteres
`

`
cep: deve ser um cep válido.
`

`
specialties: Array de números de 1 a 8, deve conter pelo menos dois números
`

####

#### Response:

```json
message: Doctor successfully registered!
status: 201
```

####

#

### Get all registered doctors

```
http://localhost:5000
GET /doctors
```

#### Response:

```json
status: 200
data:[
	{
		"id": 1,
		"name": "Almeida",
		"crm": "7554611",
		"telefoneFixo": "81374098174",
		"telefoneCelular": "813298470349",
		"cep": "60720096",
		"specialties": [
			"Alergologia",
			"Angiologia",
			"Buco maxilo",
			"Cardiologia infantil",
			"Cirurgia cabeça e pescoço"
		]
	},
	{
		"id": 2,
		"name": "Carlos",
		"crm": "7554622",
		"telefoneFixo": "85374098174",
		"telefoneCelular": "853298470349",
		"cep": "79002051",
		"specialties": [
			"Alergologia",
			"Angiologia",
		]
	},
  ...
]
```

### Get doctor by queries and params

```
http://localhost:5000
GET /doctors/:id
GET /doctors?name={}
GET /doctors?crm={}
GET /doctors?telefoneFixo={}
GET /doctors?telefoneCelular={}}
GET /doctors?cep={}
GET /doctors?name=specialties={}
```

#### Response:

```json
status:200
data:
[
	{
		"id": 1,
		"name": "Almeida",
		"crm": "7554611",
		"telefoneFixo": "81374098174",
		"telefoneCelular": "813298470349",
		"cep": "60720096",
		"specialties": [
			"Alergologia",
			"Angiologia",
			"Buco maxilo",
			"Cardiologia infantil",
			"Cirurgia cabeça e pescoço"
		]
	}
]
```
### Cep query

```json
status:200
data:
[
	{
		"id": 1,
		"name": "Almeida",
		"crm": "7554611",
		"telefoneFixo": "81374098174",
		"telefoneCelular": "813298470349",
		"specialties": [
			"Alergologia",
			"Angiologia",
			"Buco maxilo",
			"Cardiologia infantil",
			"Cirurgia cabeça e pescoço"
		],
		"address": {
			"cep": "60720-096",
			"logradouro": "Rua Cônego de Castro",
			"complemento": "até 1538 - lado par",
			"bairro": "Parangaba",
			"localidade": "Fortaleza",
			"uf": "CE",
			"ibge": "2304400",
			"gia": "",
			"ddd": "85",
			"siafi": "1389"
		}
	}
]
```

### Update doctor info

```
http://localhost:5000
PATCH /doctors/update/:id
```

#### Request:

| Params  | Type     | Description            |
| :------ | :------- | :--------------------- |
| `id`    | `integer`| **Required**. doctorId |

####

| Body              | Type       | Description                          |
| :---------------- | :--------- | :----------------------------------- |
| `name`            | `string`   | **Optional**. doctor name            |
| `crm`             | `string`   | **Optional**. doctor crm             |
| `telefoneFixo`    | `string`   | **Optional**. doctor telefoneFixo    |
| `telefoneCelular` | `string`   | **Optional**. doctor telefoneCelular |
| `cep`             | `string`   | **Optional**. doctor cep             |
| `specialties`     | `number[]` | **Optional**. doctor specialties     |

#### Response:

```json
status:200
updatedData:
{
	"id": 1,
	"name": "Almeida",
	"crm": "7554611",
	"telefoneFixo": "81374098174",
	"telefoneCelular": "813298470349",
	"cep": "60720096",
	"specialties": [
		"Cirurgia cabeça e pescoço",
		"Cirurgia cardíaca"
	]
}
```
#

### Soft delete doctor

```
http://localhost:5000
PATCH /doctors/delete/:id
```

#### Request:

| Params  | Type     | Description            |
| :------ | :------- | :--------------------- |
| `id`    | `integer`| **Required**. doctorId |

#### Response:
```json
message: Doctor deactivated from system!
```

#

### Re-activate soft deleted doctor

```
http://localhost:5000
PATCH doctors/activate/:id
```

#### Request:

| Params  | Type     | Description            |
| :------ | :------- | :--------------------- |
| `id`    | `integer`| **Required**. doctorId |

#### Response:
```json
message: Doctor active!
```

#

## Environment Variables

`
POSTGRES_HOST=gcb-db
`

`
POSTGRES_PORT=5432
`

`
POSTGRES_USER=postgres
`

`
POSTGRES_PASSWORD=1234
`

`
POSTGRES_DATABASE=gcb
`

`
PORT=5000
`

`
NODE_ENV=development
`
#

## Run Locally

Clone the project

```bash
  git clone https://github.com/FKnight-cyber/DoctorApi
```

Start the server

`
First remember to create .env, check .env-example archive.
`

`on root folder`
```bash
  run: npm run docker-compose up --build -d
```

## Run e2e tests

```bash
 run: npm run test:e2e
```
#

## Run unit tests

```bash
 run: npm run test:watch doctor.service.spec.ts
```

```bash
 run: npm run test:watch specialty.service.spec.ts
```
#

## Lessons Learned

Apesar de simples foi um projeto que me fez aprender bastante, até então não tinha desenvolvido nenhum projeto com NestJS e TypeORM, gostei muito da forma como o Nest lida com o Typescript.
Foi uma experiência nova e gratificante construir uma API com Nest.js .

## Authors

-   Ryan Nicholas a full-stack developer looking for new challenges!.
<br/>

#