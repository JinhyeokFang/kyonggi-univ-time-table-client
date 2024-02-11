'use client';
import { Card } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { zeroFill } from '@/util/util';

export const LargeLecture = ({
  lecture,
  onClick,
  buttonText,
}) => {
    return (
      <>
        <Card className="grid grid-cols-3 gap-2 w-full p-2" key={lecture.id}>
						<span className="text-sm text-center">캠퍼스</span>
						<span className="text-sm text-center">학점</span>
						<span className="text-sm text-center">학년</span>
            <span className="text-sm text-center">{lecture.campusName}</span>
            <span className="text-sm text-center">{lecture.credit}</span>
            <span className="text-sm text-center">{lecture.grade}</span>
						<span className="text-sm text-center">강의번호</span>
						<span className="text-sm text-center">학과</span>
						<span className="text-sm text-center">이름</span>
            <span className="text-sm text-center">{zeroFill(lecture.lectureNumber + "", 4)}</span>
            <span className="text-sm text-center">{lecture.major}</span>
            <span className="text-sm text-center">{lecture.name}</span>
						<span className="text-sm text-center">교수</span>
						<span className="text-sm text-center">강의실</span>
						<span className="text-sm text-center">시간</span>
            <span className="text-sm text-center">{lecture.professor}</span>
            <span className="text-sm text-center">{lecture.room}</span>
            <span className="text-sm text-center">{lecture.time}</span>
						<span className="text-sm text-center col-span-2">시간대구분</span>
						<span className="text-sm text-center">&nbsp;</span>
            <span className="text-sm text-center col-span-2">{lecture.group}</span>
            <Button color="primary" onClick={onClick}>
              { buttonText }
            </Button>
        </Card>
      </>
    );
}