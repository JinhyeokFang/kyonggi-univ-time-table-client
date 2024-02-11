'use client'
import { Card } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import { CAMPUS } from "@/config/campus";
import { CATEGORY } from "@/config/category";
import { GRADE } from "@/config/grade";
import { LectureApi } from "./api/lecture.api";
import { useState } from "react";
import { hasDuplicates, splitTime, zeroFill } from "@/util/util";

export default function Home() {
	const [lectures, setLectures] = useState<Record<string, string>[]>([]);
	const [campus, setCampus] = useState<string>("");
	const [category, setCategory] = useState<string>("");
	const [grade, setGrade] = useState<string>("");
	const [professor, setProfessor] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [major, setMajor] = useState<string>("");
	const [timeTable, setTimeTable] = useState<Record<string, unknown[]>>({
    '월': [],
    '화': [],
    '수': [],
    '목': [],
    '금': [],
		lectures: []
  });
	const onSearchButtonClicked = async () => {
		const lecturesFromApi = await LectureApi.loadLectures({campusName: campus, category, grade, professor, name, major});
		setLectures(lecturesFromApi);
	}

	const onAddLectureButtonClicked = async (lecture: unknown) => {
		let lectures;
		if (timeTable.lectures.some(item => item.id == lecture.id)) {
			lectures = timeTable.lectures.filter(item => item.id != lecture.id);
		} else {
			lectures = timeTable.lectures.concat(lecture);
		}
		const newTimeTable: Record<string, string[]> = {
			'월': [],
			'화': [],
			'수': [],
			'목': [],
			'금': [],
		};
		for (const item of lectures) {
			const newData = splitTime(item.time);
			for (const day in newData) {
					newTimeTable[day] = newTimeTable[day].concat(newData[day].map(time => ({time, lecture: item}) ) );
					if (hasDuplicates(newTimeTable[day].map(item => item.time))) {
						alert("시간이 겹치는 강의가 존재합니다.");
						return;
					}
			}
		}
		setTimeTable({
			...newTimeTable,
			lectures,
		});
	}

	return (
		<>
			<Card className="flex-col items-center justify-center p-4 w-full">
				<h1 className="text-center">시간표</h1>
				<div className="border-blue-300 border w-full">
					<div className="grid grid-cols-5 text-center">
							<span className="text-sm text-center p-2 border-blue-300 border">월</span>
							<span className="text-sm text-center p-2 border-blue-300 border">화</span>
							<span className="text-sm text-center p-2 border-blue-300 border">수</span>
							<span className="text-sm text-center p-2 border-blue-300 border">목</span>
							<span className="text-sm text-center p-2 border-blue-300 border">금</span>
					</div>
					{
						[1,2,3,4,5,6,7,8,9,10].map((item) => (
							<div className="grid grid-cols-5 text-center" key={item}>
									<div className="text-sm text-center p-2 border-blue-300 border">{ timeTable['월'].some(time => time.time == item) ? timeTable['월'].find(time => time.time == item).lecture.name : '-' }</div>
									<div className="text-sm text-center p-2 border-blue-300 border">{ timeTable['화'].some(time => time.time == item) ? timeTable['화'].find(time => time.time == item).lecture.name : '-' }</div>
									<div className="text-sm text-center p-2 border-blue-300 border">{ timeTable['수'].some(time => time.time == item) ? timeTable['수'].find(time => time.time == item).lecture.name : '-' }</div>
									<div className="text-sm text-center p-2 border-blue-300 border">{ timeTable['목'].some(time => time.time == item) ? timeTable['목'].find(time => time.time == item).lecture.name : '-' }</div>
									<div className="text-sm text-center p-2 border-blue-300 border">{ timeTable['금'].some(time => time.time == item) ? timeTable['금'].find(time => time.time == item).lecture.name : '-' }</div>
							</div>
						))
					}
				</div>
			</Card>


			<Card className="flex-col items-center justify-center p-4 mt-2 gap-4 w-full">
				<h1 className="text-center">추가한 강의 목록</h1>
				<div className="grid grid-cols-12 w-full p-2 text-center">
						<span className="text-sm text-center">캠퍼스</span>
						<span className="text-sm text-center">이수구분</span>
						<span className="text-sm text-center">학점</span>
						<span className="text-sm text-center">학년</span>
						<span className="text-sm text-center">시간대구분</span>
						<span className="text-sm text-center">강의번호</span>
						<span className="text-sm text-center">학과</span>
						<span className="text-sm text-center">이름</span>
						<span className="text-sm text-center">교수</span>
						<span className="text-sm text-center">강의실</span>
						<span className="text-sm text-center">시간</span>
						<span className="text-sm text-center">추가여부</span>
				</div>
				{
					timeTable.lectures.map(lecture => (
						<Card className="grid grid-cols-12 w-full p-2" key={lecture.id}>
							<span className="text-sm text-center">{lecture.campusName}</span>
							<span className="text-sm text-center">{lecture.category}</span>
							<span className="text-sm text-center">{lecture.credit}</span>
							<span className="text-sm text-center">{lecture.grade}</span>
							<span className="text-sm text-center">{lecture.group}</span>
							<span className="text-sm text-center">{zeroFill(lecture.lectureNumber + "", 4)}</span>
							<span className="text-sm text-center">{lecture.major}</span>
							<span className="text-sm text-center">{lecture.name}</span>
							<span className="text-sm text-center">{lecture.professor}</span>
							<span className="text-sm text-center">{lecture.room}</span>
							<span className="text-sm text-center">{lecture.time}</span>
							<Button color="primary" onClick={() => onAddLectureButtonClicked(lecture)}>
								{ timeTable.lectures.some(item => item.id == lecture.id) ? "제거" : "추가"}
							</Button>
					</Card>
					))
				}
			</Card>

			<Card className="flex-col items-center justify-center mt-2 p-4 w-full">
				<div className="flex items-center w-full">
					<Dropdown>
						<DropdownTrigger className="mr-2">
							<Button 
								variant="bordered" 
							>
								{ campus || "캠퍼스 선택" }
							</Button>
						</DropdownTrigger>
						<DropdownMenu items={CAMPUS} selectionMode="single" onSelectionChange={keys => setCampus(Array.from(keys).join(", ").replaceAll("_", " "))}>
							{(item: {key: string, label: string}) => (
								<DropdownItem
									key={item.key}
								>
									{item.label}
								</DropdownItem>
							)}
						</DropdownMenu>
					</Dropdown>
					<Dropdown>
						<DropdownTrigger className="m-2">
							<Button 
								variant="bordered" 
							>
								{ category || "이수구분 선택" }
							</Button>
						</DropdownTrigger>
						<DropdownMenu items={CATEGORY} selectionMode="single" onSelectionChange={keys => setCategory(Array.from(keys).join(", ").replaceAll("_", " "))}>
							{(item: {key: string, label: string}) => (
								<DropdownItem
									key={item.key}
								>
									{item.label}
								</DropdownItem>
							)}
						</DropdownMenu>
					</Dropdown>
					<Dropdown>
						<DropdownTrigger className="m-2">
							<Button 
								variant="bordered" 
							>
								{ grade || "학년 선택" }
							</Button>
						</DropdownTrigger>
						<DropdownMenu items={GRADE} selectionMode="single" onSelectionChange={keys => setGrade(Array.from(keys).join(", ").replaceAll("_", " "))}>
							{(item: {key: string, label: string}) => (
								<DropdownItem
									key={item.key}
								>
									{item.label}
								</DropdownItem>
							)}
						</DropdownMenu>
					</Dropdown>
					<Input type="title" placeholder="과목명" className="m-2 w-30" variant="bordered" onChange={(e) => setName(e.target.value)}/>
					<Input type="title" placeholder="교수명" className="m-2 w-30" variant="bordered" onChange={(e) => setProfessor(e.target.value)}/>
					<Input type="title" placeholder="학과명" className="m-2 w-30" variant="bordered" onChange={(e) => setMajor(e.target.value)}/>
				</div>
				<Button variant="shadow" color="primary" className="w-full m-2" onClick={onSearchButtonClicked}>
					검색
				</Button>
			</Card>
			<Card className="flex-col items-center justify-center p-4 mt-2 gap-4 w-full">
				<h1 className="text-red-500">주의</h1>
				<h2 className="text-red-500">잘못 기입된 강의가 존재할 수 있습니다. 시간표를 다 만드시고 나서 꼭 수강신청 사이트에서 확인해주세요!!</h2>
				<div className="grid grid-cols-12 w-full p-2 text-center">
						<span className="text-sm text-center">캠퍼스</span>
						<span className="text-sm text-center">이수구분</span>
						<span className="text-sm text-center">학점</span>
						<span className="text-sm text-center">학년</span>
						<span className="text-sm text-center">시간대구분</span>
						<span className="text-sm text-center">강의번호</span>
						<span className="text-sm text-center">학과</span>
						<span className="text-sm text-center">이름</span>
						<span className="text-sm text-center">교수</span>
						<span className="text-sm text-center">강의실</span>
						<span className="text-sm text-center">시간</span>
						<span className="text-sm text-center">추가여부</span>
				</div>
				{
					lectures.map(lecture => (
						<Card className="grid grid-cols-12 w-full p-2" key={lecture.id}>
							<span className="text-sm text-center">{lecture.campusName}</span>
							<span className="text-sm text-center">{lecture.category}</span>
							<span className="text-sm text-center">{lecture.credit}</span>
							<span className="text-sm text-center">{lecture.grade}</span>
							<span className="text-sm text-center">{lecture.group}</span>
							<span className="text-sm text-center">{zeroFill(lecture.lectureNumber + "", 4)}</span>
							<span className="text-sm text-center">{lecture.major}</span>
							<span className="text-sm text-center">{lecture.name}</span>
							<span className="text-sm text-center">{lecture.professor}</span>
							<span className="text-sm text-center">{lecture.room}</span>
							<span className="text-sm text-center">{lecture.time}</span>
							<Button color="primary" onClick={() => onAddLectureButtonClicked(lecture)}>
								{ timeTable.lectures.some(item => item.id == lecture.id) ? "제거" : "추가"}
							</Button>
					</Card>
					))
				}
			</Card>
		</>
	);
}
