import {Client} from "@elastic/elasticsearch";
import {LoggerPlugin} from "@taikai/scribal/dist/lib/types";

const {
  NEXT_ELASTIC_SEARCH_URL: node,
  NEXT_ELASTIC_SEARCH_USERNAME: username,
  NEXT_ELASTIC_SEARCH_PASSWORD: password,
  NEXT_LOG_APP_NAME: index = "webnetwork-logs"
} = process.env;

export const elasticLoggerMaker = (index_name: any = `bepro-app-logs`): LoggerPlugin => ({
  log(level, contents) {
    if (!node || !username || !password) {
      console.debug(`\n\tTrying to use elastic-search indexer but missing env-vars\n`);
      return;
    }

    /* this is needed because Scribal makes magic */
    const _params = contents?.[1]?.[0];
    const params =
      (typeof _params === "string" || typeof _params === "number")
        ? {value: _params}
        : Array.isArray(_params)
          ? {value_array: _params}
          : _params;

    new Client({node, auth: {username, password}})
      .index({
        index: `${index_name}-${index}`,
        document: {
          level,
          message: contents[0],
          params,
          createdAt: new Date().toISOString(),
        }
      })
      .catch(e => {
        console.log(`Failed to log on elastic`, e);
      });

  }
})

export const _scribbalLogger = () => elasticLoggerMaker()