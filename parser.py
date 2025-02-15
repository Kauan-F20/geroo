import json
import requests
import sys
from datetime import datetime
import pytz

desired_timezone = pytz.timezone('America/Sao_Paulo')

TODAY = datetime.now(desired_timezone)

METRICS_SONAR = [
    "files",
    "functions",
    "complexity",
    "comment_lines_density",
    "duplicated_lines_density",
    "coverage",
    "ncloc",
    "tests",
    "test_errors",
    "test_failures",
    "test_execution_time",
    "security_rating",
]

BASE_URL = "https://sonarcloud.io/api/measures/component_tree?component="

if __name__ == "__main__":

    REPO_COMPONENT_KEY = sys.argv[1]
    REPO = sys.argv[2]
    RELEASE_VERSION = sys.argv[3].replace('/', '')

    response = requests.get(
        f'{BASE_URL}{REPO_COMPONENT_KEY}&metricKeys={",".join(METRICS_SONAR)}&ps=500'
    )
    j = json.loads(response.text)

    file_path = f'./analytics-raw-data/fga-eps-mds-{REPO}-{TODAY.strftime("%m-%d-%Y-%H-%M-%S")}-{RELEASE_VERSION}.json'

    with open(file_path, "w") as fp:
        fp.write(json.dumps(j))
        fp.close()