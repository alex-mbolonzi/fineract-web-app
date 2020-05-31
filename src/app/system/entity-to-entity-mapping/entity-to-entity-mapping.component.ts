/** Angular Imports */
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

/** Custom Services */
import { SystemService } from 'app/system/system.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/**
 * Entity to Entity Mapping Component
 */
@Component({
  selector: 'mifosx-entity-to-entity-mapping',
  templateUrl: './entity-to-entity-mapping.component.html',
  styleUrls: ['./entity-to-entity-mapping.component.scss']
})
export class EntityToEntityMappingComponent implements OnInit {

  /** Stores entity to entity mapping data */
  entityMappings: string[] = [];
  /** Stores Id of selected mapping type */
  selectedMappingType = 0;
  /** Stores Id of first Entity filter */
  selectedFromId = 0;
  /** Stores Id of second Entity filter */
  selectedToId = 0;
  /** Checks wheter the filter is default or customized */
  hasClickedFilters = false;
  /** Selected Entity Id */
  retrieveById = 0;
  /** relative Id */
  relId: number;
  /** Stores filtered data */
  filterPreference: any;
  /** Checks where add form is to be displayed */
  addScreenFilter = false;

  /**
   * stores the data for clicked mapType
   */
  firstEntityData: string[] = [];
  secondEntityData: string[] = [];
  firstMappingEntity: string;
  secondMappingEntity: string;
  /** Data source for entity table. */
  datasource: MatTableDataSource<any>;
  /** Data source for entity to entity list data. */
  entityMappingsListData: MatTableDataSource<any>;
  /** Filter Preference Form */
  filterPreferenceForm: FormGroup;
  /** Add entity Form */
  addMappingForm: FormGroup;
  /** List of Entity to Entity Mapping */
  displayedColumns: string[] = ['entitymapping'];
  /** Columns for details of a chosen mapping */
  entityMappingListColumns: string[] = ['fromentity', 'toentity', 'startdate', 'enddate', 'edit', 'delete'];

  /** Paginator for entity table. */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /** Sorter for entity table. */
  @ViewChild(MatSort) sort: MatSort;

  /**
   * Retrieves the codes data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   */
  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private systemService: SystemService,
    private datePipe: DatePipe) {
    this.route.data.subscribe((data: { entityMappings: any }) => {
      this.entityMappings = data.entityMappings;
    });
  }

  /**
   * Creates the filter preference form.
   */
  createFilterPreferenceForm() {
    this.filterPreferenceForm = this.formBuilder.group({
      'mappingFirstParamId': ['', Validators.required],
      'mappingSecondParamId': ['', Validators.required]
    });
  }

  /**
   * Sets the mapping table.
   */
  ngOnInit() {
    this.setMapping();
  }

  setMapping() {
    this.datasource = new MatTableDataSource(this.entityMappings);
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }

  /**
   * Displays filter based on mapping id
   * @param id Entity Mapping Id
   */
  showFilters(id: number) {
    this.selectedMappingType = id;
    this.hasClickedFilters = false;
    this.fetchRelatedData(this.selectedMappingType);
    this.selectedFromId = 0;
    this.selectedToId = 0;
  }

  /** Fetches data based on the selected mapping type */
  fetchRelatedData(id: number) {
    this.retrieveById = id;
    this.createFilterPreferenceForm();
    switch (this.retrieveById) {

      case 1:
        this.systemService.getOffices().subscribe((response: any) => {
          this.firstEntityData = response;
          this.firstMappingEntity = 'Office';
        });
        this.systemService.getLoanProducts().subscribe((response: any) => {
          this.secondEntityData = response;
          this.secondMappingEntity = 'Loan Products';
        });
        break;
      case 2:
        this.systemService.getOffices().subscribe((response: any) => {
          this.firstEntityData = response;
          this.firstMappingEntity = 'Office';
        });
        this.systemService.getSavingProducts().subscribe((response: any) => {
          this.secondEntityData = response;
          this.secondMappingEntity = 'Saving Products';
        });
        break;
      case 3:
        this.systemService.getOffices().subscribe((response: any) => {
          this.firstEntityData = response;
          this.firstMappingEntity = 'Office';
        });
        this.systemService.getCharges().subscribe((response: any) => {
          this.secondEntityData = response;
          this.secondMappingEntity = 'Charges';
        });
        break;
      case 4:
        this.systemService.getRoles().subscribe((response: any) => {
          this.firstEntityData = response;
          this.firstMappingEntity = 'Role';
        });
        this.systemService.getLoanProducts().subscribe((response: any) => {
          this.secondEntityData = response;
          this.secondMappingEntity = 'Loan Products';
        });
        break;
      case 5:
        this.systemService.getRoles().subscribe((response: any) => {
          this.firstEntityData = response;
          this.firstMappingEntity = 'Role';
        });
        this.systemService.getSavingProducts().subscribe((response: any) => {
          this.secondEntityData = response;
          this.secondMappingEntity = 'Saving Products';
        });
        break;
    }

  }

  /**
   * Submits the filter preference form and creates a entityMappingList data
   */
  showFilteredData() {
    this.filterPreference = this.filterPreferenceForm.value;
    if (this.filterPreference.mappingFirstParamId === '') {
      this.filterPreference.mappingFirstParamId = 0;
    }
    if (this.filterPreference.mappingSecondParamId === '') {
      this.filterPreference.mappingSecondParamId = 0;
    }
    this.hasClickedFilters = true;
    this.addScreenFilter = false;

    this.selectedFromId = this.filterPreference.mappingFirstParamId;
    this.selectedToId = this.filterPreference.mappingSecondParamId;
    this.systemService.getEntitytoEntityData(this.retrieveById, this.selectedFromId, this.selectedToId).subscribe((response: any) => {
      this.entityMappingsListData = new MatTableDataSource(response);
      // this.entityMappingsListData.paginator = this.paginator;
      // this.entityMappingsListData.sort = this.sort;
    });
  }

  /**
   * Creates the add mapping form
   */
  createAddMappingForm() {
    this.addMappingForm = this.formBuilder.group({
      'fromId': ['', Validators.required],
      'toId': ['', Validators.required],
      'startDate': [''],
      'endDate': ['']
    });
  }

  /**
   * Shows the add entity screen
   * @param selectedType selected Map Type
   */
  showAddScreen(selectedType: number) {
    this.createAddMappingForm();
    this.relId = selectedType;
    this.hasClickedFilters = false;
    this.addScreenFilter = true;
    this.fetchRelatedData(this.relId);
  }


  /**
   * Submits the new mapping
   * @param id Map type id
   */
  submitNew(id: number) {

    if (this.addMappingForm.value.fromId === '') {
      this.addMappingForm.value.fromId = undefined;
    }
    if (this.addMappingForm.value.toId === '') {
      this.addMappingForm.value.toId = undefined;
    }
    this.relId = id;
    const dateFormat = 'dd MMMM yyyy';

    const startDate: Date = this.addMappingForm.value.startDate;
    const endDate: Date = this.addMappingForm.value.endDate;

    this.addMappingForm.patchValue({
      startDate: this.datePipe.transform(startDate, dateFormat),
      endDate: this.datePipe.transform(endDate, dateFormat)
    });
    const newMappingData = this.addMappingForm.value;
    newMappingData.dateFormat = dateFormat;
    newMappingData.locale = 'en';
    this.systemService.createMapping(this.relId, newMappingData).subscribe((response: any) => {
      this.showFilteredData();
    });
  }

  /**
   * Cancels the add entity operation
   */
  cancelOperation() {
    this.hasClickedFilters = true;
    this.addScreenFilter = false;
  }

}
