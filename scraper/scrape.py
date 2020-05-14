import re
import sys
import json
import time
import requests
import requests_cache
from bs4 import BeautifulSoup

AY_START = "2020"
AY_SEM = "1"

MAIN_URL = "https://wish.wis.ntu.edu.sg/webexe/owa/aus_schedule.main"
SCHEDULE_URL = "https://wish.wis.ntu.edu.sg/webexe/owa/AUS_SCHEDULE.main_display1"

requests_cache.install_cache("cache", allowable_methods=("GET", "POST"), expire_after=24*3600)

def test_pattern(pattern, inp, label):
    if re.match(pattern, inp) == None:
        raise Exception(f'{label} has an invalid format: "{inp}" does not match {pattern}')

def get_course(header_table, content_table):
    # ignore online courses
    if "Online Course" in content_table.text:
        return False
    
    course = {
        "code": "",
        "name": "",
        "au": "",
        "indexes": []
    }

    for y, row in enumerate(header_table.find_all("tr")):
        for x, col in enumerate(row.find_all("td")):
            cell = col.text.strip()

            if y == 0:
                if x == 0:
                    course["code"] = cell
                elif x == 1:
                    course["name"] = cell
                elif x == 2:
                    test_pattern(r'^(?:\d+)?\.\d AU$', cell, "AU")
                    course["au"] = cell
    
    header_row = content_table.find("tr")
    for i, col in enumerate(header_row.find_all("th")):
        assert(col.text == ["INDEX", "TYPE", "GROUP", "DAY", "TIME", "VENUE", "REMARK"][i])
    
    index = {
        "id": "",
        "lessons": []
    }

    index_no = False
    for y, row in enumerate(content_table.find_all("tr")[1:]):
        lesson = {
            "type": "",
            "group": "",
            "day": "",
            "time": "",
            "venue": "",
            "remark": ""
        }
        for x, col in enumerate(row.find_all("td")):
            cell = col.text.strip()

            if x == 0 and cell:
                test_pattern(r'^\d+$', cell, "Index")

                # if a index has already been filled out
                # and this row is a new one, save it
                if index_no:
                    course["indexes"].append(index)

                index_no = cell

                index = {
                    "id": index_no,
                    "lessons": []
                }
            elif x == 1:
                # skip courses with no type info
                if not cell:
                    return False

                lesson["type"] = cell
            elif x == 2:
                lesson["group"] = cell
            elif x == 3:
                if not cell in ("MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"):
                    raise Exception(f'Invalid day: {cell}')
                
                lesson["day"] = cell
            elif x == 4:
                test_pattern(r'^\d{4}-\d{4}$', cell, "Time")
                lesson["time"] = cell
            elif x == 5:
                lesson["venue"] = cell
            elif x == 6:
                lesson["remark"] = cell
        
        index["lessons"].append(lesson)
    
    # save last index
    if index_no:
        course["indexes"].append(index)
    
    return course

def load_schedule(year, semester, course):
    r = requests.post(SCHEDULE_URL, data={
        "acadsem": f'{year};{semester}',
        "r_course_yr": course,
        "r_subj_code": "Enter Keywords or Course Code",
        "r_search_type": "F",
        "boption": "CLoad",
        "staff_access": False
    })

    r.raise_for_status()

    soup = BeautifulSoup(r.text, "html.parser")

    tables = soup.find_all("table")

    # should have an even number of tables, two for each module
    assert(len(tables) % 2 == 0)

    courses = {}
    for i in range(0, len(tables), 2):
        header_table = tables[i]
        content_table = tables[i+1]

        course = get_course(header_table, content_table)
        if course:
            courses[course["code"]] = course
    
    return r.from_cache, courses

def main():
    r = requests.get(MAIN_URL)
    r.raise_for_status()

    soup = BeautifulSoup(r.text, "html.parser")
    options_courses = [option["value"] for option in soup.select_one("select[name='r_course_yr']").find_all("option")]
    options_courses = list(filter(None, options_courses))
    
    courses = {}

    for option in options_courses:
        print(f'Loading courses for {option}')

        cache_hit, found_courses = load_schedule(AY_START, AY_SEM, option)
        courses.update(found_courses)

        if not cache_hit:
            time.sleep(1)
    
    with open(sys.argv[1], "w") as f:
        f.write(json.dumps(courses))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f'Usage: {sys.argv[0]} outfile.json')
        sys.exit(1)
    
    main()
