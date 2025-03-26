"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const colors: any = {
    LIST: {
        color: "hsl(var(--chart-1))",
    },
    CREATE: {
        color: "hsl(var(--chart-2))",
    },
    UPDATE: {
        color: "hsl(var(--chart-3))",
    },
    READ: {
        color: "hsl(var(--chart-4))",
    },
    DELETE: {
        color: "hsl(var(--chart-5))",
    },
}
import { Label, Pie, PieChart } from "recharts"

export function StateChart({ activityState }: any) {

    const activityState_ = activityState.map((e: any) => {
        return {
            ...e,
            fill: colors[e.type].color
        }
    })

    return (
        <Card className="flex flex-col col-span-1 bg-muted/40 backdrop-blur">
            <CardHeader className="items-center pb-0">
                <CardTitle>Requests Type</CardTitle>
                <CardDescription>Showing all requests type</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={{}}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={activityState_}
                            dataKey="count"
                            nameKey="type"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {activityState_.reduce((sum: any, item: any) => sum + item.count, 0)}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Request
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
