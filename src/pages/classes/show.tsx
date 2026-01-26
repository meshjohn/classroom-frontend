import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { bannerPhoto } from "@/lib/cloudinary";
import { ClassDetails } from "@/types";
import { useShow } from "@refinedev/core";
import { AdvancedImage } from "@cloudinary/react";

const ClassesShow = () => {
  const { query } = useShow<ClassDetails>({ resource: "classes" });
  const ClassDetails = query.data?.data;
  const { isLoading, isError } = query;
  if (isLoading || isError || !ClassDetails) {
    return (
      <ShowView className="class-view class-show">
        <ShowViewHeader resource="classes" title="Class Details" />
        <p className="state-message">
          {isLoading
            ? "Loading class details..."
            : isError
            ? "Failed to load class details."
            : "Class details not found."}
        </p>
      </ShowView>
    );
  }
  const teacherName = ClassDetails.teacher?.name;
  const teacherInitials = teacherName
    ?.split(" ")
    .filter(Boolean)
    .splice(0, 2)
    .map((name) => name[0]?.toUpperCase())
    .join("");
  const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(
    teacherInitials || "NA",
  )}`;

  const {
    name,
    description,
    status,
    capacity,
    courseCode,
    courseName,
    bannerCldPubId,
    bannerUrl,
    schedules,
    subject,
    teacher,
    department,
    inviteCode,
  } = ClassDetails;
  return (
    <ShowView className="class-view class-show">
      <ShowViewHeader resource="classes" title="Class Details" />
      <div className="banner">
        {bannerUrl ? (
          <AdvancedImage cldImg={bannerPhoto(bannerCldPubId ?? '', name)} />
        ) : (
          <div className="placeholder" />
        )}
      </div>
      <Card className="details-card">
        <div className="details-header">
          <div className="">
            <h1>{name}</h1>
            <p>{description}</p>
          </div>

          <div className="">
            <Badge variant="outline">{capacity} spots</Badge>
            <Badge
              variant={status === "active" ? "default" : "secondary"}
              data-status={status}
            >
              {status.toUpperCase()}
            </Badge>
          </div>
        </div>
        <div className="details-gr">
          <div className="instructor">
            <p>Instructor</p>
            <div className="">
              <img src={teacher?.image ?? placeholderUrl} alt={teacherName} />
              <div className="">
                <p>{teacherName}</p>
                <p>{teacher?.email}</p>
              </div>
            </div>
          </div>
          <div className="department">
            <p>Department</p>
            <div className="">
              <p>{department?.name}</p>
              <p>{department?.description}</p>
            </div>
          </div>
        </div>
        <Separator />
        <div className="subject">
          <p>Subject</p>
          <div className="">
            <Badge variant="outline">Code: {subject?.code}</Badge>
            <p>{subject?.name}</p>
            <p>{subject?.description}</p>
          </div>
        </div>
        <Separator />
        <div className="join">
          <h2>Join Class</h2>
          <ol>
            <li>Ask your teacher for the invite code</li>
            <li>Click on "Join Class" button</li>
            <li>Paste the code and click "join"</li>
          </ol>
        </div>
        <Button size="lg" className="w-full">
          Join Class
        </Button>
      </Card>
    </ShowView>
  );
};

export default ClassesShow;
