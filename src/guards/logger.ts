import Elysia from 'elysia'
import * as pc from 'picocolors'
import process from 'process'

export const logger = (app: Elysia) =>
        app
        .onRequest((ctx) => {
            ctx.store = { ...ctx.store, startTime: process.hrtime.bigint() }
        })
        .onBeforeHandle((ctx) => {
            ctx.store = { ...ctx.store, startTime: process.hrtime.bigint() }
        })
        .onAfterHandle(({ request, store, set }) => {
            const logStr: string[] = []

            logStr.push(methodString(request.method))

            const path = (url: string) => `${url}`;
            logStr.push(path(new URL(request.url).pathname))

            const startTime: bigint = (store as any).startTime
            logStr.push(durationString(startTime))

            const statusCode = set.status as number;
            logStr.push(statusString(statusCode));

            console.log(logStr.join(' | '))
        })
        .onError(({ request, error, store }) => {
            const logStr: string[] = []

            logStr.push(pc.red(methodString(request.method)))

            logStr.push(new URL(request.url).pathname)

            const startTime: bigint = (store as any).startTime
            logStr.push(pc.red(durationString(startTime)))

            if ('status' in error) {
                logStr.push(statusString(error.status))
            }

            console.log(logStr.join(' | '))
        })

const durationString = (beforeTime: bigint): string => {
    const now = process.hrtime.bigint()
    const timeDifference = now - beforeTime
    const nanoseconds = Number(timeDifference)

    const durationInMicroseconds = (nanoseconds / 1e3).toFixed(0) // Convert to microseconds
    const durationInMilliseconds = (nanoseconds / 1e6).toFixed(0) // Convert to milliseconds
    let timeMessage: string = ''

    if (nanoseconds >= 1e9) {
        const seconds = (nanoseconds / 1e9).toFixed(2)
        timeMessage = `[${seconds}s]`
    } else if (nanoseconds >= 1e6) {
        timeMessage = `[${durationInMilliseconds}ms]`
    } else if (nanoseconds >= 1e3) {
        timeMessage = `[${durationInMicroseconds}µs]`
    } else {
        timeMessage = `[${nanoseconds}ns]`
    }

    return pc.cyan(timeMessage)
}

const methodString = (method: string): string => {
    // const maxMethodLength = 9
    const methodStr = pc.black(" " + method + " ");

    switch (method) {
        case 'GET':
            return pc.bgCyan(methodStr)

        case 'POST':
            return pc.bgYellow(methodStr)

        case 'PUT':
            return pc.bgBlue(methodStr)

        case 'DELETE':
            return pc.bgRed(methodStr)

        case 'PATCH':
            return pc.bgGreen(methodStr)

        case 'OPTIONS':
            return pc.bgWhite(methodStr)

        case 'HEAD':
            return pc.bgMagenta(methodStr)

        default:
            return methodStr
    }
}

const statusString = (statusCode: number) => {
    const statusStr = pc.black(" " + statusCode + " ");

    switch (statusCode) {
        case 200:
            return pc.bgGreenBright(statusStr);
        case 201:
            return pc.bgGreen(statusStr);
        case 400:
            return pc.bgYellowBright(statusStr);
        case 404:
            return pc.bgYellow(statusStr);
        case 422:
            return pc.bgRedBright(statusStr);
        case 500:
            return pc.bgRedBright(statusStr);
        default:
            return pc.bgBlackBright(statusStr);
    }
}