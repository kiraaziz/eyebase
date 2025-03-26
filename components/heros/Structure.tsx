"use client";

import React, { forwardRef, useRef } from "react";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/heros/animated-beam";
import { Eyebase } from "../global/Logo";
import { Code, Database, Grid2x2Icon, Package, Settings, Users } from "lucide-react";

const Circle = forwardRef<
    HTMLDivElement,
    { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "z-10 flex size-20 items-center justify-center rounded-full  bg-muted/20  border backdrop-blur-2xl p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
                className,
            )}
        >
            {children}
        </div>
    );
});

Circle.displayName = "Circle";

export default function Structure() {
    const containerRef = useRef<HTMLDivElement>(null);
    const div1Ref = useRef<HTMLDivElement>(null);
    const div2Ref = useRef<HTMLDivElement>(null);
    const div3Ref = useRef<HTMLDivElement>(null);
    const div4Ref = useRef<HTMLDivElement>(null);
    const div5Ref = useRef<HTMLDivElement>(null);
    const div6Ref = useRef<HTMLDivElement>(null);
    const div7Ref = useRef<HTMLDivElement>(null);
    const div8Ref = useRef<HTMLDivElement>(null);
    const div9Ref = useRef<HTMLDivElement>(null);
    const div10Ref = useRef<HTMLDivElement>(null);
    const div11Ref = useRef<HTMLDivElement>(null);
    const div12Ref = useRef<HTMLDivElement>(null);
    const div13Ref = useRef<HTMLDivElement>(null);

    return (
        <div
            className="relative flex h-max  w-full items-center justify-center overflow-hidden rounded-lg p-10"
            ref={containerRef}
        >
            <div className="flex size-full  max-w-full h-max items-center justify-between gap-10  flex-row">
                <div className="flex flex-col gap-10">
                    <Circle ref={div1Ref}>
                        <Database size={20} />
                    </Circle>
                    <Circle ref={div2Ref}>
                        <Database size={20} />
                    </Circle>
                    <Circle ref={div3Ref}>
                        <Database size={20} />
                    </Circle>
                </div>
                <div className="flex flex-col gap-10">
                    <Circle ref={div4Ref} className="size-32">
                        <Eyebase size='m' haveText={false} isMove={true} isBlur={true} />
                    </Circle>
                </div>
                <div className="flex flex-col gap-10">
                    <Circle ref={div6Ref} className="w-52 gap-3">
                        <Code size={20} />
                        API
                        <span className="text-primary bg-primary/10 px-2 rounded text-xs">/go/v0.1</span>
                    </Circle>
                </div>
                <div className="flex flex-col gap-12">
                    <Circle ref={div9Ref} className="w-56 gap-3 ">
                        LIST
                        <span className="text-primary bg-primary/10 px-2 rounded text-xs">[GET]/</span>
                    </Circle>
                    <Circle ref={div10Ref} className="w-56 gap-3 ">
                        CREATE
                        <span className="text-primary bg-primary/10 px-2 rounded text-xs">[POST]/</span>
                    </Circle>
                    <Circle ref={div11Ref} className="w-56 gap-3 ">
                        READ
                        <span className="text-primary bg-primary/10 px-2 rounded text-xs">[GET]/:id</span>
                    </Circle>
                    <Circle ref={div12Ref} className="w-56 gap-3 ">
                        UPDATE
                        <span className="text-primary bg-primary/10 px-2 rounded text-xs">[PUT]/:id</span>
                    </Circle>
                    <Circle ref={div13Ref} className="w-56 gap-3 ">
                        DELETE
                        <span className="text-primary bg-primary/10 px-2 rounded text-xs">[DELETE]/:id</span>
                    </Circle>
                </div>
                <div className="flex flex-col gap-10">
                    <Circle ref={div8Ref} className="w-52 gap-3 bg-primary/20 text-primary border-primary">
                        <Grid2x2Icon size={20} />
                        You Apps
                    </Circle>
                </div>
            </div>

            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div1Ref}
                toRef={div4Ref}
                curvature={0}
                endYOffset={0}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div2Ref}
                toRef={div4Ref}
                endYOffset={0}
                curvature={0}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div3Ref}
                toRef={div4Ref}
                curvature={0}
                endYOffset={0}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div6Ref}
                toRef={div4Ref}

                endYOffset={0}
                curvature={0}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div6Ref}
                toRef={div9Ref}
                endYOffset={-30}
                curvature={300}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div6Ref}
                toRef={div10Ref}
                endYOffset={-30}
                curvature={150}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div6Ref}
                toRef={div11Ref}
                endYOffset={0}
                curvature={0}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div6Ref}
                toRef={div12Ref}
                endYOffset={30}
                curvature={-150}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div6Ref}
                toRef={div13Ref}
                endYOffset={30}
                curvature={-300}
            />

            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div8Ref}
                toRef={div9Ref}
                endYOffset={-30}
                curvature={300}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div8Ref}
                toRef={div10Ref}
                endYOffset={-30}
                curvature={150}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div8Ref}
                toRef={div11Ref}
                endYOffset={0}
                curvature={0}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div8Ref}
                toRef={div12Ref}
                endYOffset={30}
                curvature={-150}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div8Ref}
                toRef={div13Ref}
                endYOffset={30}
                curvature={-300}
            />
        </div>
    );
} 